import path from 'node:path';
import ffmpeg from '../index.js';
import coraline from 'coraline';

coraline.createScriptExec(
  async () => {
    const toTest = '/home/simonegauli/web/.coraline/tiktak/static/videos/q3ky2_3Trp0.mp4';
    await ffmpeg({ input: toTest, noVideo: true, output: toTest.replace(path.extname(toTest), '.mp3') });
  },
  { repeat: true },
);
