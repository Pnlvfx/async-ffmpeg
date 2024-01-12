import { spawn } from 'node:child_process';
import internal from 'node:stream';

/** @internal */
export const startCommand = async (command: string, params: string[], stream?: internal.Readable) => {
  return new Promise<void>((resolve, reject) => {
    const ffmpegProcess = spawn(command, params);
    if (stream) {
      stream.on('error', (err) => {
        reject(`Encountered stream error: ${err.message}`);
      });

      stream.resume();
      stream.pipe(ffmpegProcess.stdin);

      ffmpegProcess.stdin.on('error', (err) => reject(err));
    }

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
