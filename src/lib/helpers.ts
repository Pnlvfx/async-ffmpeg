import type { AudioBitrate } from '../types/ffmpeg.js';

export const isValidAudioBitrate = (value: string | number): value is AudioBitrate => {
  return (typeof value === 'string' && value.includes('k')) || typeof value === 'number';
};
