/* eslint-disable sonarjs/prefer-single-boolean-return */
/* eslint-disable sonarjs/cognitive-complexity */
import { FFmpegParams, StartTime } from '../types';

type Value = string | boolean | number | StartTime | string[];

function isStartTime(obj: Value): obj is StartTime {
  if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean') return false;
  if ('hours' in obj) return true;
  if ('minutes' in obj) return true;
  if ('seconds' in obj) return true;
  if ('milliseconds' in obj) return true;
  return false;
}

const transcode = (key: keyof FFmpegParams, value: Value): string[] => {
  if (key === 'override') {
    return ['-y'];
  }
  if (key === 'inputSeeking') {
    if (!isStartTime(value)) throw new Error('input should be typeof object!');
    const { hours, milliseconds, minutes, seconds } = value;
    return ['-ss', `${hours || '00'}:${minutes || '00'}:${seconds || '00'}:${milliseconds || '000'}`];
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
    if (!isStartTime(value)) throw new Error('input should be typeof object!');
    const { hours, milliseconds, minutes, seconds } = value;
    return ['-ss', `${hours || '00'}:${minutes || '00'}:${seconds || '00'}:${milliseconds || '000'}`];
  }
  if (key === 'duration') {
    return ['-t', value.toString()];
  }
  if (key === 'codecAudio') {
    if (typeof value !== 'string') throw new Error('codecAudio should be typeof string!');
    return ['-c:a', value];
  }
  if (key === 'loop') {
    return ['-loop', value.toString()];
  }
  if (key === 'framerate') {
    return ['-framerate', value.toString()];
  }
  if (key === 'codecVideo') {
    if (typeof value !== 'string') throw new Error('codecVideo should be typeof string!');
    return ['-c:v', value];
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
    return [key, value.toString()];
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
