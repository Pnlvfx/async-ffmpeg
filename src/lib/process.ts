import { spawn } from 'node:child_process';

/** @internal */
export const startCommand = async (command: string, params: string[]) => {
  return new Promise<void>((resolve, reject) => {
    const ffmpegProcess = spawn(command, params);

    let wasResolved = false;
    let stderr = '';

    ffmpegProcess.on('error', (err) => {
      reject(err);
    });

    // ffmpegProcess.stdout.on('data', (data) => {
    //   console.log(`stdout: ${data}`);
    // });

    ffmpegProcess.stderr.on('data', (data) => {
      const stderrData = data.toString();
      stderr += stderrData;
      // getProgress(stderrData);
    });

    ffmpegProcess.on('close', (code) => {
      if (wasResolved) return;
      if (code === 0) {
        resolve();
        wasResolved = true;
      } else {
        reject(stderr);
      }
    });

    ffmpegProcess.on('exit', (code) => {
      if (wasResolved) return;
      if (code === 0) {
        resolve();
        wasResolved = true;
      } else {
        reject(stderr);
      }
    });
  });
};
