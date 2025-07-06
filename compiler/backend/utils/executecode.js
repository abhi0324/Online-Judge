import {exec} from 'child_process'; // To execute system command (like g++, python)
import fs from 'fs'; // For file system operation (read/write/delete)
import path from 'path'; // for building platform independent file paths
import {v4 as uuidv4} from 'uuid'; // To generate unique filename for each run 

export const executeCode = (code, language, input='') => {
    return new Promise((resolve, reject) => {
        const filename = uuidv4();
        let sourcePath = '';
        let inputPath = path.join('temp', `${filename}_input.txt`);
        let command = '';

        try {
            if(input){
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
                  return reject('Unsupported language');
              }

              if(input){
                command +=` < ${inputPath}`;
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
                } 
                catch (cleanupErr) {
                  console.error('Cleanup error:', cleanupErr.message);
                }
          
                // Handle execution error
                if (err) {
                    return reject(stderr || err.message);
                }
          
                // Send result
                return resolve(stdout.trim());
              });
        }
        catch(error){
            return reject('Server error during execution');
        }
    })
}