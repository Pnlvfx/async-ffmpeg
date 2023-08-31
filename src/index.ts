/* eslint-disable sonarjs/cognitive-complexity */
import { spawn } from 'node:child_process';
import { getProgress } from './lib/progress.js';
import { getParams } from './lib/params.js';
import { FFmpegParams } from './types/index.js';

const ffmpeg = (params: FFmpegParams) => {
  return new Promise<string>((resolve, reject) => {
    const ffmpegParams = getParams(params);
    console.log(ffmpegParams);
    const ffmpegProcess = spawn('ffmpeg', ffmpegParams);

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
        resolve(params.output);
      } else {
        reject(error);
      }
    });
  });
};

export default ffmpeg;
