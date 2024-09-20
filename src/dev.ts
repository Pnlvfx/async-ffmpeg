/* eslint-disable no-console */
import coraline from 'coraline';
import ffmpeg from './index.js';

const run = async () => {
  await coraline.input.create();
  const screenCapture = ffmpeg.screenCapture({ display: ':1', framerate: 25, width: 1024, height: 768, x: 1024, y: 768, output: 'Hello.mp4' });
  const check = screenCapture.startRecording();
  await coraline.wait(10_000);
  await screenCapture.stopRecording();
  await check;
  console.log('Screen recorded');
  void run();
};

void run();
