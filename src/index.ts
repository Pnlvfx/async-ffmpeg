import { ffprobe } from './lib/ffprobe.js';
import { getParams } from './lib/params.js';
import { startCommand } from './lib/process.js';
import { FFmpegParams } from './types/index.js';
async function ffmpeg(params: FFmpegParams) {
  const ffmpegParams = getParams(params);
  // console.log(...ffmpegParams);
  await startCommand('ffmpeg', ffmpegParams);
  return params.output;
}

ffmpeg.ffprobe = ffprobe;

export default ffmpeg;

export { VideoFilter } from './constants/video-filter.js';

// export { parseDuration, parseDurationNum } from './lib/time.js';
