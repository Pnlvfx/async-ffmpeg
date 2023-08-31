/* eslint-disable sonarjs/cognitive-complexity */
import { spawn } from 'node:child_process';
import { getProgress } from './lib/progress.js';
import { FFmpegOptions, StartTime } from './types/index.js';

const transcode = (key: keyof FFmpegOptions, value: string | boolean | number | StartTime | string[]): string[] => {
  if (key === 'output' || key === 'override') throw new Error('Unhandled key');
  if (key === 'input') {
    if (typeof value !== 'string') throw new Error('input should be typeof string!');
    return ['-i', value];
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
  return [];
};

const getParams = (input: string, options: FFmpegOptions) => {
  const params = [];
  if (options.override) {
    params.push('-y');
  }
  if (options.inputSeeking) {
    // MAKE IT BEFORE THE -i TO START FROM THE SELECTED INPUT SEEKING
    const { hours, milliseconds, minutes, seconds } = options.inputSeeking;
    params.push('-ss', `${hours || '00'}:${minutes || '00'}:${seconds || '00'}:${milliseconds || '000'}`);
  }
  params.push('-i', input);
  if (options.outputSeeking) {
    // MAKE IT BEFORE AFTER -i TO STOP ON THE SELECTED OUTPUT SEEKING
    const { hours, milliseconds, minutes, seconds } = options.outputSeeking;
    params.push('-ss', `${hours || '00'}:${minutes || '00'}:${seconds || '00'}:${milliseconds || '000'}`);
  }
  const arr = Object.entries(options);
  for (const [k, value] of arr) {
    const key = k as keyof FFmpegOptions;
    if (key === 'output' || key === 'override' || key === 'inputSeeking' || key === 'outputSeeking') {
      continue;
    }
    const p = transcode(key, value);
    params.push(...p);
  }
  return [...params, options.output];
};

const ffmpeg = (input: string, options: FFmpegOptions) => {
  const params = getParams(input, options);
  console.log(params);
  return new Promise<string>((resolve, reject) => {
    const ffmpegProcess = spawn('ffmpeg', params);

    ffmpegProcess.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });

    let error = '';

    ffmpegProcess.stderr.on('data', (data) => {
      const stderrData = data.toString();
      error += stderrData;
      getProgress(stderrData);
    });

    ffmpegProcess.on('close', (code) => {
      if (code === 0) {
        resolve(options.output);
      } else {
        reject(error);
      }
    });
  });
};

export default ffmpeg;
