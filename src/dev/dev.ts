import fs from 'node:fs';
import ffmpeg from '../index.js';
import path from 'node:path';

const testImageZoom = async () => {
  const imagepath = path.join(process.cwd(), 'media/images');
  const images = await fs.promises.readdir(imagepath);
  const image = path.join(imagepath, images[0]);
  const output = path.join(imagepath, '..', 'output', 'output.mp4');
  const video = await ffmpeg({
    override: true,
    loop: 1,
    framerate: 25,
    input: image,
    videoFilter: `[0:v]scale=4000x8000,zoompan=z='min(zoom+0.0015,1.5)':d=125:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1080x1920`,
    codecVideo: 'libx264',
    pixelFormat: 'yuv420p',
    duration: 5,
    output,
  });
  console.log(video);
};

testImageZoom();
