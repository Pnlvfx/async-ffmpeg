/* eslint-disable sonarjs/cognitive-complexity */
import type { AudioBitrate, FFmpegParams, Time } from '../types/index.js';

type Value = string | boolean | number | Time | string[];

const isStartTime = (obj: Value): obj is Time => {
  if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean' || Array.isArray(obj)) return false;
  if ('hours' in obj) return true;
  if ('minutes' in obj) return true;
  if ('seconds' in obj) return true;
  if ('milliseconds' in obj) return true;
  for (const [k, value] of Object.entries(obj)) {
    const key = k as keyof Time;
    if (key === 'milliseconds') {
      if (value.toString().length > 3) throw new Error('Invalid milliseconds format! Maximum 3 numbers, example: 000');
    } else if (value.toString().length > 2) throw new Error('Invalid -ss format, it should contain maximum two numbers, example: 01');
  }
  return false;
};

export const isValidAudioBitrate = (value: string | number): value is AudioBitrate => {
  return (typeof value === 'string' && value.includes('k')) || typeof value === 'number';
};

const formatTimeUnit = (length: number, unit?: number) => {
  if (unit) {
    const unitStr = unit.toString();
    return unitStr.length === length ? unitStr : '0'.repeat(length - unitStr.length) + unitStr;
  }
  return '0'.repeat(length);
};

const transcode = (key: keyof FFmpegParams, value?: Value | undefined): string[] => {
  if (key === 'inputSeeking' && value) {
    if (isStartTime(value)) {
      const { hours, milliseconds, minutes, seconds } = value;
      const fixedHours = formatTimeUnit(2, hours);
      const fixedMinutes = formatTimeUnit(2, minutes);
      const fixedSeconds = formatTimeUnit(2, seconds);
      const fixedMs = formatTimeUnit(3, milliseconds);
      return ['-ss', `${fixedHours}:${fixedMinutes}:${fixedSeconds}.${fixedMs}`];
    } else if (typeof value === 'number') {
      return ['-ss', value.toString()];
    } else throw new Error('ss should be typeof object or string!');
  }
  if (key === 'input') {
    if (typeof value === 'string') {
      return ['-i', value];
    } else if (Array.isArray(value)) {
      const arr = [];
      for (const v of value) {
        arr.push('-i', v);
      }
      return arr;
    } else throw new Error('input should be typeof string or array of strings!');
  }
  if (key === 'audio') {
    if (typeof value !== 'string') throw new Error('audio should be typeof string!');
    return ['-i', value];
  }
  if (key === 'outputSeeking' && value) {
    if (isStartTime(value)) {
      const { hours, milliseconds, minutes, seconds } = value;
      const fixedHours = formatTimeUnit(2, hours);
      const fixedMinutes = formatTimeUnit(2, minutes);
      const fixedSeconds = formatTimeUnit(2, seconds);
      const fixedMs = formatTimeUnit(3, milliseconds);
      return ['-ss', `${fixedHours}:${fixedMinutes}:${fixedSeconds}.${fixedMs}`];
    } else if (typeof value === 'number') {
      return ['-ss', value.toString()];
    } else throw new Error('ss should be typeof object or string!');
  }
  if (key === 'duration' && value) {
    if (isStartTime(value)) {
      const { hours, milliseconds, minutes, seconds } = value;
      const fixedHours = formatTimeUnit(2, hours);
      const fixedMinutes = formatTimeUnit(2, minutes);
      const fixedSeconds = formatTimeUnit(2, seconds);
      const fixedMs = formatTimeUnit(3, milliseconds);
      return ['-t', `${fixedHours}:${fixedMinutes}:${fixedSeconds}.${fixedMs}`];
    } else if (typeof value === 'number') {
      return ['-t', value.toString()];
    } else throw new Error('duration should be typeof object or string!');
  }
  if (key === 'codec') {
    if (typeof value !== 'string') throw new Error('codec should be typeof string!');
    return ['-c', value];
  }
  if (key === 'audioCodec') {
    if (typeof value !== 'string') throw new Error('codecAudio should be typeof string!');
    return ['-c:a', value];
  }
  if (key === 'audioBitrate') {
    if (typeof value === 'string') {
      return ['-b:a', value];
    } else if (typeof value === 'number') {
      return ['-b:a', value.toString() + 'k'];
    } else throw new Error('audioBitrate should be typeof string or number!');
  }
  if (key === 'videoCodec') {
    if (typeof value !== 'string') throw new Error('codecVideo should be typeof string!');
    return ['-c:v', value];
  }
  if (key === 'loop') {
    if (typeof value !== 'number') throw new Error('loop should be typeof number!');
    return ['-loop', value.toString()];
  }
  if (key === 'framerate') {
    if (typeof value !== 'number') throw new Error('framerate should be typeof number!');
    return ['-framerate', value.toString()];
  }
  if (key === 'videoFilter') {
    if (typeof value !== 'string') throw new Error('videoFilter should be typeof string!');
    return ['-vf', value];
  }
  if (key === 'pixelFormat') {
    if (typeof value !== 'string') throw new Error('pixelFormat should be typeof string!');
    return ['-pix_fmt', value];
  }
  if (key === 'map') {
    if (typeof value === 'string') {
      return ['-map', value];
    } else if (Array.isArray(value)) {
      const arr = [];
      for (const v of value) {
        arr.push('-map', v);
      }
      return arr;
    } else throw new Error('map should be typeof string or an array of strings!');
  }
  if (key === 'videoFrames') {
    if (typeof value !== 'number') throw new Error('video-frames should be typeof number!');
    return ['-vframes', value.toString()];
  }
  if (key === 'extra') {
    if (!Array.isArray(value)) throw new Error('output should be typeof string!');
    return value;
  }
  if (key === 'output') {
    if (typeof value !== 'string') throw new Error('Output should be a string!');
    return [value];
  }
  if (key === 'noVideo' && value === true) {
    return ['-vn'];
  }
  if (key === 'outputFormat') {
    if (typeof value !== 'string') throw new Error('Output format should be a string.');
    return ['-f', value];
  }
  throw new Error('Unsupported command provided, please open an issue if you think that this command should exist.');
};

/** @internal */
export const getParams = (options: FFmpegParams) => {
  const params = ['-y'];
  for (const [k, value] of Object.entries(options)) {
    const key = k as keyof FFmpegParams;
    const p = transcode(key, value);
    params.push(...p);
  }
  return params;
};
