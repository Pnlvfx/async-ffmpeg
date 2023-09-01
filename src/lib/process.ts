import { spawn } from 'node:child_process';
import { getProgress } from './progress.js';

export const startCommand = async (command: string, params: string[]) => {
  return new Promise<void>((resolve, reject) => {
    const ffmpegProcess = spawn(command, params);

    ffmpegProcess.on('error', (err) => {
      reject(err);
    });

    ffmpegProcess.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });

    let error = '';

    ffmpegProcess.stderr.on('data', (data) => {
      const stderrData = data.toString();
      error += stderrData;
      getProgress(stderrData);
    });

    ffmpegProcess.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(error);
      }
    });
  });
};
