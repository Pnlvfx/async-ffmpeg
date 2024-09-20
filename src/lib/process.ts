import { spawn } from 'node:child_process';
import internal from 'node:stream';

export const startCommand = async (command: string, params: string[], stream?: internal.Readable) => {
  return new Promise<void>((resolve, reject) => {
    const ffmpegProcess = spawn(command, params);
    if (stream) {
      stream.on('error', reject);

      stream.resume();
      stream.pipe(ffmpegProcess.stdin);

      ffmpegProcess.stdin.on('error', reject);
    }

    let wasResolved = false;
    let stderr: '';

    ffmpegProcess.on('error', reject);

    ffmpegProcess.stderr.on('data', (data: Buffer) => {
      stderr += data.toString();
      // getProgress(stderrData);
    });

    const onEnd = (code: number) => {
      if (wasResolved) return;
      if (code === 0) {
        resolve();
        wasResolved = true;
      } else {
        reject(new Error(`FFmpeg error: ${stderr}`));
      }
    };

    ffmpegProcess.on('close', onEnd);

    ffmpegProcess.on('exit', onEnd);
  });
};
