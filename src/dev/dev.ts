import fs from 'node:fs';
import ffmpeg from '../index.js';
import path from 'node:path';

const testImageZoom = async () => {
  const imagepath = path.join(process.cwd(), 'media/images');
  const images = await fs.promises.readdir(imagepath);
  const image = path.join(imagepath, images[0]);
  const output = path.join(imagepath, '..', 'output', 'output.mp4');
  const video = await ffmpeg({
    input: image,
    override: true,
    loop: 1,
    framerate: 25,
    videoFilter: `zoompan=z='min(zoom+0.0015,1.5)':d=125:s=1080x1920`,
    codecVideo: 'libx264',
    duration: 5,
    output,
  });
  console.log(video);
};

testImageZoom();
