/* eslint-disable sonarjs/no-os-command-from-path */
import { type ChildProcessWithoutNullStreams, spawn } from 'node:child_process';
import os from 'node:os';

const isLinux = os.platform() === 'linux';

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

let isRunning = false;

export const X11ScreenCapture = ({ display, framerate, height, width, x, y, output }: ScreenCaptureParams) => {
  if (!isLinux) throw new Error('Screen capture has only been tested on linux systems for now.');
  if (isRunning) throw new Error('Please use the screen capture only once at a time.');

  let ffmpegProcess: ChildProcessWithoutNullStreams | undefined;

  const startRecording = () => {
    return new Promise<void>((resolve, reject) => {
      ffmpegProcess = spawn('ffmpeg', [
        '-y',
        '-video_size',
        `${width.toString()}x${height.toString()}`,
        '-framerate',
        framerate.toString(),
        '-f',
        'x11grab',
        '-i',
        `${display}.0+${x.toString()},${y.toString()}`,
        output,
      ]);
      isRunning = true;

      ffmpegProcess.on('error', reject);

      let error = '';

      ffmpegProcess.stderr.on('data', (chunk: Buffer) => {
        error += chunk.toString();
      });

      ffmpegProcess.on('close', (code) => {
        isRunning = false;
        if (code === 0) resolve();
        else reject(new Error(error));
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
