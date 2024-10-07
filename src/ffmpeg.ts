import type { FFmpegParams } from './types/ffmpeg.js';
import { ffprobe } from './lib/ffprobe.js';
import { getParams } from './lib/params.js';
import { startCommand } from './lib/process.js';
import { screenCapture } from './lib/screen-capture.js';
import internal from 'node:stream';

async function ffmpeg({ debug, ...params }: FFmpegParams) {
  const ffmpegParams = getParams(params);
  if (debug) {
    // eslint-disable-next-line no-console
    console.log(...ffmpegParams);
  }
  await startCommand('ffmpeg', ffmpegParams, params.input instanceof internal.Readable ? params.input : undefined);
}

ffmpeg.ffprobe = ffprobe;
ffmpeg.screenCapture = screenCapture;

export default ffmpeg;

export { isValidAudioBitrate } from './lib/helpers.js';
export type { Time } from './types/ffmpeg.js';
