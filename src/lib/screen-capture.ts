import { type ChildProcessWithoutNullStreams, spawn } from 'node:child_process';
import { isLinux } from '../constants/constants.js';

export interface ScreenCaptureParams {
  /** This refers to the display number and screen number. 0.0 is usually the default display and screen on a system. */
  display: string;
  /**The video size width. */
  width: number;
  /**The video size height. */
  height: number;
  /**The video framerate. */
  framerate: number;
  /** The x position from where you want to start grabbing the screen. */
  x: number;
  /** The y position from where you want to start grabbing the screen. */
  y: number;
  /** The output of the captured video. */
  output: string;
}

export const screenCapture = ({ display, framerate, height, width, x, y, output }: ScreenCaptureParams) => {
  if (!isLinux) throw new Error('Screen capture has only been tested on linux systems for now.');

  let ffmpegProcess: ChildProcessWithoutNullStreams | undefined;

  const startRecording = () => {
    return new Promise<void>((resolve, reject) => {
      ffmpegProcess = spawn('ffmpeg', [
        '-y',
        '-video_size',
        `${width}x${height}`,
        '-framerate',
        framerate.toString(),
        '-f',
        'x11grab',
        '-i',
        `${display}.0+${x},${y}`,
        output,
      ]);

      ffmpegProcess.on('error', reject);

      let error = '';

      ffmpegProcess.stderr.on('data', (chunk) => {
        error += chunk.toString();
      });

      ffmpegProcess.on('close', (code) => {
        if (code === 0) resolve();
        else reject(error);
      });

      ffmpegProcess.stdin.on('error', reject);
    });
  };

  const stopRecording = () => {
    return new Promise<void>((resolve, reject) => {
      if (ffmpegProcess && !ffmpegProcess.killed) {
        ffmpegProcess.stdin.write('q\n', (err) => {
          if (err) reject(err);
          else resolve();
        });
      } else {
        resolve();
      }
    });
  };

  return {
    startRecording,
    stopRecording,
  };
};
