import express from 'express';
import {exec} from 'child_process'; // To execute system command (like g++, python)
import fs from 'fs'; // For file system operation (read/write/delete)
import path from 'path'; // for building platform independent file paths
import {v4 as uuidv4} from 'uuid'; // To generate unique filename for each run 

const router = express.Router();

router.post('/', async (req, res) => {
  const { code, language, input } = req.body;
  
  if(!code || !language) {    
    return res.status(400).json({error: 'Code and language are required'});
  }
  
  const filename = uuidv4(); // Generate unique id for file
  let sourcePath = '';
  let inputPath = path.join('temp', `${filename}_input.txt`);
  let command = '';

  try{
    if(input) {
      fs.writeFileSync(inputPath, input);
    }
  
    switch(language){
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
        return res.status(400).json({error: 'Unsupported language'});
    }
  
    if(input){
      command += `< ${inputPath}`;
    }

    exec(command, (err, stdout, stderr)=>{
      // Cleanup
      try {
        if (fs.existsSync(sourcePath)) fs.rmSync(sourcePath, { force: true });
        if (fs.existsSync(inputPath)) fs.rmSync(inputPath, { force: true });
        if (language === 'cpp' && fs.existsSync(`temp/${filename}`)) {
          fs.rmSync(`temp/${filename}`, { force: true });
        }
        if (language === 'java' && fs.existsSync(`temp/${filename}.class`)) {
          fs.rmSync(`temp/${filename}.class`, { force: true });
        }
      } catch (cleanupErr) {
        console.error('Cleanup error:', cleanupErr.message);
      }

      // Handle execution error
      if (err) {
        return res.status(400).json({ output: stderr || err.message });
      }

      // Send result
      return res.json({ output: stdout });
    });

  }
  catch(error){
    return res.status(500).json({error: 'Server error while running code'});
  }

})

export default router;
