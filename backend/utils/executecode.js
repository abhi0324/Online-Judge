import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export const executeCode = (code, language, input = '') => {
    return new Promise((resolve, reject) => {
        const filename = uuidv4();
        let sourcePath = '';
        let inputPath = path.join('temp', `${filename}_input.txt`);
        let command = '';

        try {
            if (!fs.existsSync('temp')) {
                fs.mkdirSync('temp');
            }

            // Detect input usage
            const requiresInput = (
                (language === 'cpp' && /cin\s*>>/.test(code)) ||
                (language === 'python' && /\binput\s*\(/.test(code)) ||
                (language === 'java' && /\.next\s*\(/.test(code))
            );

            // If code expects input but none provided
            if (requiresInput && !input.trim()) {
                return reject("Your program is waiting for input, but no input was provided.");
            }

            // Write input to file if provided
            if (input.trim()) {
                fs.writeFileSync(inputPath, input);
            }

            // Prepare compile & run commands
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
                    return reject('Unsupported language');
            }

            // Add input redirection if input exists
            if (input.trim()) {
                command += ` < ${inputPath}`;
            }

            // Execute with a 5-second timeout
            exec(command, { timeout: 5000 }, (err, stdout, stderr) => {
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

                if (err) {
                    if (err.killed) {
                        return reject('Execution timed out (possible infinite loop)');
                    }
                    return reject(stderr || err.message);
                }

                return resolve(stdout.trim());
            });
        } catch (error) {
            return reject('Server error during execution');
        }
    });
};
