/* eslint-disable sonarjs/cognitive-complexity */
import { FFmpegParams, Time } from '../types';

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

const formatTimeUnit = (length: number, unit?: number) => {
  if (unit) {
    const unitStr = unit.toString();
    return unitStr.length === length ? unitStr : '0'.repeat(length - unitStr.length) + unitStr;
  }
  return '0'.repeat(length);
};

const transcode = (key: keyof FFmpegParams, value: Value): string[] => {
  if (key === 'override') {
    return ['-y'];
  }
  if (key === 'inputSeeking') {
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
  if (key === 'outputSeeking') {
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
  if (key === 'duration') {
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
  if (key === 'codecAudio') {
    if (typeof value !== 'string') throw new Error('codecAudio should be typeof string!');
    return ['-c:a', value];
  }
  if (key === 'codecVideo') {
    if (typeof value !== 'string') throw new Error('codecVideo should be typeof string!');
    return ['-c:v', value];
  }
  if (key === 'loop') {
    return ['-loop', value.toString()];
  }
  if (key === 'framerate') {
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
    return ['-vframes', value.toString()];
  }
  if (key === 'extra') {
    if (!Array.isArray(value)) throw new Error('output should be typeof string!');
    return value;
  }
  if (key === 'output') {
    if (typeof value !== 'string') throw new Error('output should be typeof string!');
    return [value];
  }
  return [];
};

export const getParams = (options: FFmpegParams) => {
  const params = [];
  for (const [k, value] of Object.entries(options)) {
    const key = k as keyof FFmpegParams;
    const p = transcode(key, value);
    params.push(...p);
  }
  return params;
};
