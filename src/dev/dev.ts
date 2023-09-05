// const testImageZoom = async () => {
//   const imageDirectory = path.join(process.cwd(), 'media/images');
//   const images = await fs.promises.readdir(imageDirectory);
//   const filename = images.at(0);
//   if (!filename) return;
//   const image = path.join(imageDirectory, filename);
//   const duration = Math.ceil(10.14);
//   const zoom: 'in' | 'out' = 'in';
//   //inputs up
//   const framerate = 24;
//   const frames = duration * framerate;
//   let zoomEffect;
//   if (zoom === 'in') {
//     zoomEffect = VideoFilter.Zoompan.zoomInAtCenter(1080, 1920, { zoomIncrement: 0.0015, maxZoom: 1.5 });
//   } else {
//     const zoomOutFromCenter = `[0:v]scale=4000x8000,zoompan=z='if(lte(zoom,1.0),1.5,max(1.001,zoom-0.0023))':x='max(1,iw/2-(iw/zoom/2))':y='max(1,ih/2-(ih/zoom/2))':d=${frames}:s=1080x1920`;
//     zoomEffect = zoomOutFromCenter;
//   }
//   const output = path.join(imageDirectory, '..', 'output', 'output.mp4');
//   const video = await ffmpeg({
//     override: true,
//     loop: 1,
//     framerate: 24,
//     input: image,
//     videoFilter: zoomEffect,
//     codecVideo: 'libx264',
//     pixelFormat: 'yuv420p',
//     duration,
//     output,
//   });
//   const { streams } = await ffmpeg.ffprobe(video);
//   console.log({ video, duration: streams.at(0)?.duration });
// };

import path from 'node:path';
import ffmpeg from '../index.js';

// it's incomplete
const testNoVideo = async () => {
  const videoPath = path.join(process.cwd(), 'media', 'test.mov');
  const output = path.join(process.cwd(), 'media', 'test.mp4');
  await ffmpeg({
    input: videoPath,
    noVideo: true,
    audioCodec: 'libmp3lame',
    output,
  });
};

// const testNoVideoFluent = () => {
//   const videoPath = path.join(process.cwd(), 'media', 'test.mov');
//   const output = path.join(process.cwd(), 'media', 'test.mp4');
//   const cmd = fluent(videoPath)
//     .noVideo()
//     .audioCodec('libmp3lame')
//     .on('start', (cmd) => console.log(cmd));

//   cmd.seekInput(1);

//   cmd.save(output);
// };

// testNoVideoFluent();

testNoVideo();
