import { describe, it } from '@jest/globals';
import path from 'node:path';
import { ffmpeg } from '../src/ffmpeg.js';
import fs from 'node:fs';
import coraline, { temporaryDirectorySync } from 'coraline';

const input = path.join('media', 'video.mp4');
const temporaryDir = temporaryDirectorySync();
const output = path.join(temporaryDir, 'output.mp4');
const outputStream = path.join(temporaryDir, 'output-stream.mp4');

describe('concat function', () => {
  it(
    'should convert a stream with ffmpeg successfully',
    async () => {
      await ffmpeg({ debug: true, input: fs.createReadStream(input), output: outputStream });
    },
    2 * 60 * 1000,
  );

  it(
    'should convert a File with ffmpeg successfully',
    async () => {
      await ffmpeg({ input, output });
    },
    2 * 60 * 1000,
  );

  afterAll(async () => {
    await coraline.rm(temporaryDir);
  });
});
