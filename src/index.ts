import type { FFmpegParams } from './types/index.js';
import { ffprobe } from './lib/ffprobe.js';
import { getParams } from './lib/params.js';
import { startCommand } from './lib/process.js';
import { isStream } from 'is-stream';
async function ffmpeg(params: FFmpegParams) {
  const ffmpegParams = getParams(params);
  if (params.debug) {
    console.log(...ffmpegParams);
  }
  let stream;
  if (isStream(params.input)) {
    stream = params.input;
  }
  await startCommand('ffmpeg', ffmpegParams, stream);
  return params.output;
}

ffmpeg.ffprobe = ffprobe;

export default ffmpeg;

export { VideoFilter } from './constants/video-filter.js';
export { isValidAudioBitrate } from './lib/params.js';

// export { parseDuration, parseDurationNum } from './lib/time.js';
