import coraline from 'coraline';
import ffmpeg from './index.js';

const run = async () => {
  await coraline.input.create();
  await ffmpeg.screenCapture({ display: ':0.0', framerate: 25, width: 1024, height: 768, x: 1024, y: 768, output: 'Hello.mp4' });
  // await ffmpeg({ input: toTest, noVideo: true, output: toTest.replace(path.extname(toTest), '.mp3') });
  run();
};

run();
