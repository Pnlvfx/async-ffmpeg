import { describe, test } from '@jest/globals';
import path from 'node:path';
import ffmpeg from '../src';
// import fs from 'node:fs';
const getFile = (file: string) => path.join(process.cwd(), file);
const output = 'example.mp4';
// const outputStream = 'example_stream.mp4';

describe('concat function', () => {
  // test(
  //   'should convert a stream with ffmpeg successfully',
  //   async () => {
  //     const file = getFile('media/video.mp4');
  //     await ffmpeg({ debug: true, input: fs.createReadStream(file), output: path.join('media', outputStream) });
  //   },
  //   2 * 60 * 1000,
  // );
  test(
    'should convert a File with ffmpeg successfully',
    async () => {
      const file = getFile('media/video.mp4');
      await ffmpeg({ input: file, output: path.join('media', output) });
    },
    2 * 60 * 1000,
  );
});
