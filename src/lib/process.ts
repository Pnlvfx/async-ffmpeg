import { spawn } from 'node:child_process';
import internal from 'node:stream';

/** @internal */
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
    let stderr: Buffer | undefined;

    ffmpegProcess.on('error', reject);

    ffmpegProcess.stderr.on('data', (data) => {
      stderr += data;
      // getProgress(stderrData);
    });

    const onEnd = (code: number) => {
      if (wasResolved) return;
      if (code === 0) {
        resolve();
        wasResolved = true;
      } else {
        reject(`FFmpeg error: ${stderr?.toString() || 'Unknown ffmpeg error'}`);
      }
    };

    ffmpegProcess.on('close', onEnd);

    ffmpegProcess.on('exit', onEnd);
  });
};
