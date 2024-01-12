import { describe, it } from '@jest/globals';
import path from 'node:path';
import os from 'node:os';
import ffmpeg from '../src';
const isMac = os.platform() === 'darwin';
const getFile = (file: string) => path.join(process.cwd(), file);
const output = isMac ? 'example_mac.mp4' : 'example_linux.mp4';

describe('concat function', () => {
  it(
    'should convert videos with ffmpeg successfully',
    async () => {
      const file = getFile('media/video.mp4');
      await ffmpeg({ input: file, output: path.join('media', output) });
    },
    2 * 60 * 1000,
  );
});
