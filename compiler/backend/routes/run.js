import express from 'express';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

router.post('/', async (req, res) => {
  const { code, language, input } = req.body;

  if (!code || !language) {
    return res.status(400).json({ error: 'Code and language are required' });
  }

  const filename = uuidv4();
  let sourcePath = '';
  let inputPath = path.join('temp', `${filename}_input.txt`);
  let command = '';

  try {
    // Write input if exists
    if (input) {
      fs.writeFileSync(inputPath, input);
    }

    // Choose compiler command based on language
    switch (language) {
      case 'cpp':
        sourcePath = path.join('temp', `${filename}.cpp`);
        fs.writeFileSync(sourcePath, code);
        command = `g++ ${sourcePath} -o temp/${filename} && ./temp/${filename}`;
        break;

      case 'python':
        sourcePath = path.join('temp', `${filename}.py`);
        fs.writeFileSync(sourcePath, code);
        command = `python3 ${sourcePath}`;
        break;

      case 'java':
        sourcePath = path.join('temp', `${filename}.java`);
        fs.writeFileSync(sourcePath, code);
        command = `javac ${sourcePath} && java -cp temp ${filename}`;
        break;

      default:
        return res.status(400).json({ error: 'Unsupported language' });
    }

    // Add input redirection if input is present
    if (input) command += ` < ${inputPath}`;

    exec(command, (err, stdout, stderr) => {
      // Cleanup
      fs.rmSync(sourcePath, { force: true });
      if (fs.existsSync(inputPath)) fs.rmSync(inputPath, { force: true });
      if (language === 'cpp') fs.rmSync(`temp/${filename}`, { force: true });
      if (language === 'java') fs.rmSync(`temp/${filename}.class`, { force: true });

      if (err) {
        return res.status(400).json({ output: stderr || err.message });
      }

      res.json({ output: stdout });
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error while running code' });
  }
});

export default router;
