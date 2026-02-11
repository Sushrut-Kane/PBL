import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const processOCR = (pdfPath) => {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, '../scripts/ocr_script.py');
    const pythonProcess = spawn('python', [scriptPath, pdfPath]);

    let outputData = '';
    let errorData = '';

    pythonProcess.stdout.on('data', (data) => {
      outputData += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      errorData += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`OCR process failed: ${errorData}`));
      } else {
        resolve(outputData.trim());
      }
    });

    pythonProcess.on('error', (error) => {
      reject(new Error(`Failed to start OCR process: ${error.message}`));
    });
  });
};
