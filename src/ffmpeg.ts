import type { FFmpegParams } from './types/ffmpeg.js';
import { Readable } from 'node:stream';
import { startCommand } from './lib/process.js';
import { parseInput, parseTime } from './lib/params.js';

export const ffmpeg = async ({ debug, ...ffmpegParams }: FFmpegParams) => {
  const params: string[] = ['-y'];

  const getParams = ({
    inputSeeking,
    input,
    output,
    audio,
    audioBitrate,
    audioCodec,
    codec,
    duration,
    extra,
    framerate,
    loop,
    map,
    noVideo,
    outputFormat,
    outputSeeking,
    pixelFormat,
    videoCodec,
    videoFilter,
    videoFrames,
    logLevel,
    // eslint-disable-next-line sonarjs/cognitive-complexity
  }: Partial<Omit<FFmpegParams, 'debug'>>) => {
    if (inputSeeking !== undefined) {
      params.push('-ss', parseTime(inputSeeking));
    }
    if (input) {
      params.push(...parseInput(input));
    }
    if (audio) {
      params.push('-i', audio);
    }
    if (outputSeeking !== undefined) {
      params.push('-ss', parseTime(outputSeeking));
    }
    if (duration !== undefined) {
      params.push('-t', parseTime(duration));
    }
    if (codec) {
      params.push('-c', codec);
    }
    if (audioCodec) {
      params.push('-c:a', audioCodec);
    }
    if (audioBitrate !== undefined) {
      const v = typeof audioBitrate === 'string' ? audioBitrate : audioBitrate.toString() + 'k';
      params.push('-b:a', v);
    }
    if (videoCodec) {
      params.push('-c:v', videoCodec);
    }
    if (loop !== undefined) {
      params.push('-loop', loop.toString());
    }
    if (framerate !== undefined) {
      params.push('-framerate', framerate.toString());
    }
    if (videoFilter) {
      params.push('-vf', videoFilter);
    }
    if (pixelFormat) {
      params.push('-pix_fmt', pixelFormat);
    }
    if (map) {
      if (typeof map === 'string') {
        params.push('-map', map);
      } else {
        params.push(...map.map((v) => `-map ${v}`));
      }
    }
    if (videoFrames !== undefined) {
      params.push('-vframes', videoFrames.toString());
    }
    if (logLevel) {
      params.push('-loglevel', logLevel);
    }
    if (extra) {
      params.push(...extra);
    }
    if (output) {
      params.push(output);
    }
    if (noVideo) {
      params.push('-vn');
    }
    if (outputFormat) {
      params.push('-f', outputFormat);
    }
    return params;
  };

  for (const [key, value] of Object.entries(ffmpegParams)) {
    getParams({ [key]: value });
  }

  if (debug) {
    // eslint-disable-next-line no-console
    console.log(...params);
  }

  await startCommand('ffmpeg', params, ffmpegParams.input instanceof Readable ? ffmpegParams.input : undefined);
};

export { isValidAudioBitrate, type AudioBitrate } from './types/ffmpeg.js';
export type { Time } from './types/ffmpeg.js';
