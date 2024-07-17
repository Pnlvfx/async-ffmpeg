import path from 'node:path';
import coraline from 'coraline';
import ffmpeg from './index.js';

/// ITS BROKEN
const toTest = '/home/simonegauli/web/.coraline/tiktak/static/videos/q3ky2_3Trp0.mp4';

const run = async () => {
  await coraline.input.create();
  await ffmpeg({ input: toTest, noVideo: true, output: toTest.replace(path.extname(toTest), '.mp3') });
  run();
};

run();
