/* eslint-disable sonarjs/cognitive-complexity */
import { spawn } from 'node:child_process';
import { getProgress } from './lib/progress.js';
import { FFmpegOptions, VideoFilter } from './types/index.js';

const transcode = (key: keyof FFmpegOptions, value: string | boolean | number | VideoFilter): string[] => {
  if (key === 'output' || key === 'force') throw new Error('Unhandled key');
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
  return [];
};

const getParams = (input: string, options: FFmpegOptions) => {
  const params = [];
  if (options.force) {
    params.push('-y');
  }
  params.push('-i', input);
  const arr = Object.entries(options);
  for (const [k, value] of arr) {
    const key = k as keyof FFmpegOptions;
    if (key === 'output' || key === 'force') {
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
