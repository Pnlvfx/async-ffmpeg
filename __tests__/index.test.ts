import { describe, it } from '@jest/globals';
import path from 'node:path';
import ffmpeg from '../src/ffmpeg.js';
import fs from 'node:fs';

const getFile = (file: string) => path.join(process.cwd(), file);
const output = 'example.mp4';
const outputStream = 'example_stream.mp4';

describe('concat function', () => {
  it(
    'should convert a stream with ffmpeg successfully',
    async () => {
      const file = getFile('media/video.mp4');
      await ffmpeg({ debug: true, input: fs.createReadStream(file), output: path.join('media', outputStream) });
    },
    2 * 60 * 1000,
  );

  it(
    'should convert a File with ffmpeg successfully',
    async () => {
      const file = getFile('media/video.mp4');
      await ffmpeg({ input: file, output: path.join('media', output) });
    },
    2 * 60 * 1000,
  );
});
