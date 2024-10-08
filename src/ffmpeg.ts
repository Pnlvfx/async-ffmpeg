import type { FFmpegParams } from './types/ffmpeg.js';
import { getParams } from './lib/params.js';
import { startCommand } from './lib/process.js';
import internal from 'node:stream';

export async function ffmpeg({ debug, ...params }: FFmpegParams) {
  const ffmpegParams = getParams(params);
  if (debug) {
    // eslint-disable-next-line no-console
    console.log(...ffmpegParams);
  }
  await startCommand('ffmpeg', ffmpegParams, params.input instanceof internal.Readable ? params.input : undefined);
}

export { ffprobe } from './ffprobe.js';
export { screenCapture } from './screen-capture.js';

export { audioBitrates, type AudioBitrate } from './types/ffmpeg.js';
export type { Time } from './types/ffmpeg.js';
