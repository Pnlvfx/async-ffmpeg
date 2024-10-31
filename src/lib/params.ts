import type { FFmpegParams, Time } from '../types/ffmpeg.js';
import internal from 'node:stream';

export const getParams = ({
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
}: Omit<FFmpegParams, 'debug'>) => {
  const params = ['-y'];
  if (inputSeeking !== undefined) {
    params.push('-ss', parseTime(inputSeeking));
  }
  params.push(...parseInput(input));
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
    params.push('-b:a', audioBitrate.toString() + 'k');
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
  params.push(output);
  if (noVideo) {
    params.push('-vn');
  }
  if (outputFormat) {
    params.push('-f', outputFormat);
  }
  return params;
};

const parseInput = (input: string | string[] | internal.Readable) => {
  if (typeof input === 'string') return ['-i', input];
  if (Array.isArray(input)) return input.map((v) => `-i ${v}`);
  if (input instanceof internal.Readable) {
    input.pause();
    return ['-i', 'pipe:0'];
  }
  throw new Error('Invalid input provided.');
};

const parseTime = (value: Time | number) => {
  if (typeof value === 'number') return value.toString();
  const { hours, milliseconds, minutes, seconds } = value;
  const fixedHours = formatTimeUnit(2, hours);
  const fixedMinutes = formatTimeUnit(2, minutes);
  const fixedSeconds = formatTimeUnit(2, seconds);
  const fixedMs = formatTimeUnit(3, milliseconds);
  return `${fixedHours}:${fixedMinutes}:${fixedSeconds}.${fixedMs}`;
};

const formatTimeUnit = (length: number, unit?: number) => {
  if (unit) {
    const unitStr = unit.toString();
    return unitStr.length === length ? unitStr : '0'.repeat(length - unitStr.length) + unitStr;
  }
  return '0'.repeat(length);
};
