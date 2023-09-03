import ffmpeg, { VideoFilter } from '../index.js';
import path from 'node:path';
import fs from 'node:fs';
const imagepath = path.join(process.cwd(), 'media/images');

const testImageZoom = async () => {
  const images = await fs.promises.readdir(imagepath);
  const image = path.join(imagepath, images[0]);
  const duration = Math.ceil(10.14);
  const zoom: 'in' | 'out' = 'in';
  //inputs up
  const framerate = 24;
  const frames = duration * framerate;
  let zoomEffect;
  if (zoom === 'in') {
    zoomEffect = VideoFilter.Zoompan.zoomInAtCenter(1080, 1920, { zoomIncrement: 0.0015, maxZoom: 1.5 });
  } else {
    const zoomOutFromCenter = `[0:v]scale=4000x8000,zoompan=z='if(lte(zoom,1.0),1.5,max(1.001,zoom-0.0023))':x='max(1,iw/2-(iw/zoom/2))':y='max(1,ih/2-(ih/zoom/2))':d=${frames}:s=1080x1920`;
    zoomEffect = zoomOutFromCenter;
  }
  const output = path.join(imagepath, '..', 'output', 'output.mp4');
  const video = await ffmpeg({
    override: true,
    loop: 1,
    framerate: 24,
    input: image,
    videoFilter: zoomEffect,
    codecVideo: 'libx264',
    pixelFormat: 'yuv420p',
    duration,
    output,
  });
  const { streams } = await ffmpeg.ffprobe(video);
  console.log({ video, duration: streams[0].duration });
};

// const testvideo = async () => {
//   const cwd = path.join(process.cwd(), 'media');
//   const video = path.join(cwd, 'test.mp4');

//   const { streams } = await ffmpeg.ffprobe(video);
//   const stream = streams.at(0);
//   if (!stream) throw new Error('a');
//   console.log({ width: stream.width, height: stream.height });

//   const output = path.join(cwd, 'video.mp4');
//   await ffmpeg({ override: true, input: video, videoFilter: `scale=1080x1920:force_original_aspect_ratio=decrease`, output });
// };

testImageZoom();
