import fs from 'node:fs';
import ffmpeg from '../index.js';
import path from 'node:path';

const testImageZoom = async () => {
  const imagepath = path.join(process.cwd(), 'media/images');
  const images = await fs.promises.readdir(imagepath);
  const image = path.join(imagepath, images[0]);
  const output = path.join(imagepath, '..', 'output', 'output.mp4');
  const video = await ffmpeg(image, {
    force: true,
    loop: 1,
    framerate: 25,
    videoFilter: { zoompan: { frames: 400, height: 1920, width: 1080, maxZoom: 1.5, zoomIncrement: 0.0015 } },
    codecVideo: 'libx264',
    duration: 20,
    output,
  });
  console.log(video);
};

testImageZoom();
