import type { Time } from '../types/ffmpeg.js';
import { Readable } from 'node:stream';

export const parseInput = (input: string | string[] | Readable) => {
  if (typeof input === 'string') return ['-i', input];
  if (Array.isArray(input)) return input.map((v) => `-i ${v}`);
  if (input instanceof Readable) {
    input.pause();
    return ['-i', 'pipe:0'];
  }
  throw new Error('Invalid input provided.');
};

export const parseTime = (value: Time | number) => {
  if (typeof value === 'number') return value.toString();
  const { hours = 0, milliseconds = 0, minutes = 0, seconds = 0 } = value;
  const totalMilliseconds = (hours * 3600 + minutes * 60 + seconds) * 1000 + milliseconds;
  const finalHours = Math.floor(totalMilliseconds / 3_600_000);
  const finalMinutes = Math.floor((totalMilliseconds % 3_600_000) / 60_000);
  const finalSeconds = Math.floor((totalMilliseconds % 60_000) / 1000);
  const finalMilliseconds = totalMilliseconds % 1000;
  return formatTime(finalHours, finalMinutes, finalSeconds, finalMilliseconds);
};

const formatTime = (hours: number, minutes: number, seconds: number, milliseconds: number) => {
  const fixedHours = formatTimeUnit(2, hours);
  const fixedMinutes = formatTimeUnit(2, minutes);
  const fixedSeconds = formatTimeUnit(2, seconds);
  const fixedMs = formatTimeUnit(3, milliseconds);

  return `${fixedHours}:${fixedMinutes}:${fixedSeconds}.${fixedMs}`;
};

const formatTimeUnit = (length: number, unit?: number) => {
  if (unit !== undefined) {
    const unitStr = unit.toString();
    return unitStr.length === length ? unitStr : '0'.repeat(length - unitStr.length) + unitStr;
  }
  return '0'.repeat(length);
};
