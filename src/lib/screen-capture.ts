import { isLinux } from '../constants/constants.js';
import ffmpeg from '../index.js';

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

export const screenCapture = async ({ display, framerate, height, width, x, y, output }: ScreenCaptureParams) => {
  if (!isLinux) throw new Error('Screen capture has only been tested on linux systems for now.');
  await ffmpeg({
    extra: ['-video_size', `${width}x${height}`, '-framerate', framerate.toString(), 'x11grab'],
    input: `${display}.0+${x},${y}`,
    output,
  });
};
