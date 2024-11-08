import { Readable } from 'node:stream';

export interface Time {
  hours?: number;
  minutes?: number;
  seconds?: number;
  milliseconds?: number;
}

const audioBitrates = [64, 96, 128, 192, 256, 320] as const;

type AudioBitrateNumber = (typeof audioBitrates)[number];

type AudioBitrateStr = `${AudioBitrateNumber}K`;

export type AudioBitrate = AudioBitrateNumber | AudioBitrateStr;

const isValidAudioBitrateNum = (bitrate: number): bitrate is AudioBitrateNumber => {
  return audioBitrates.includes(bitrate as AudioBitrateNumber);
};

const isValidAudioBitrateStr = (bitrate: string): bitrate is AudioBitrateStr => {
  return audioBitrates.map((a) => `${a.toString()}K`).includes(bitrate as AudioBitrateStr);
};

export const isValidAudioBitrate = (bitrate: number | string): bitrate is AudioBitrate => {
  if (typeof bitrate === 'number') return isValidAudioBitrateNum(bitrate);
  return isValidAudioBitrateStr(bitrate);
};

/**
 * Options for configuring FFmpeg commands.
 */
export interface FFmpegParams {
  /** Input file path. Equivalent to the `-i` option in FFmpeg. */
  input: string | string[] | Readable;

  /** audio-only input path. Equivalent to the `-i` option in FFmpeg. */
  audio?: string;

  /** Output file path. This is a required field. */

  output: string;

  /** Duration of the output video in seconds. Equivalent to the `-t` option in FFmpeg. */
  duration?: number | Time;

  /** Codec to use. Equivalent to the `-c` option in FFmpeg. */
  codec?: 'copy';

  /** Audio codec to use. Equivalent to the `-c:a` option in FFmpeg. */
  audioCodec?: 'copy' | 'aac' | 'libmp3lame';

  /** Video codec to use. Equivalent to the `-c:v` option in FFmpeg. */
  videoCodec?: 'copy' | 'libx264';

  /** Audio bitrate in kbps for the output audio. Equivalent to the `-b:a` option in FFmpeg. */
  audioBitrate?: AudioBitrate;

  /** Number of times to loop the input. Equivalent to the `-loop` option in FFmpeg. */
  loop?: number;

  /** Frame rate of the output video. Equivalent to the `-r` option in FFmpeg. */
  framerate?: number;

  /** Video filter to apply. Equivalent to the `-vf` option in FFmpeg. */
  videoFilter?: string;

  /** Pixel format of the output video. Equivalent to the `-pix_fmt` option in FFmpeg. */
  pixelFormat?: 'yuv420p';

  /** Mapping from input streams to output streams. Equivalent to the `-map` option in FFmpeg. If it's an Array, each field is a different -map added */
  map?: string | string[];

  /** Seeking position in the input file. Equivalent to the `-ss` option in FFmpeg for input seeking. */
  inputSeeking?: Time | number;

  /** Seeking position in the output file. Equivalent to the `-ss` option in FFmpeg for output seeking. */
  outputSeeking?: Time | number;

  /** set the number of video frames to record. Equivalent to the `-vframes` option in FFmpeg. */
  videoFrames?: number;

  /** Add any extra parameter. Example: ['-video_size', '1024x768'].*/
  extra?: string[];

  /** Whetever process or not the video. Default: false.*/
  noVideo?: boolean;

  /** The output format.*/
  outputFormat?: 'mp4' | 'avi' | 'mkv' | 'webm' | 'mov' | 'flv' | 'mp3' | 'ogg' | 'wav';

  /** Whether to include debug information. Default: false.*/
  debug?: boolean;

  /** Set logging level and flags used by the library. Default value: "info". */
  logLevel?: 'info' | 'quiet' | 'panic' | 'fatal' | 'warning' | 'verbose' | 'debug' | 'trace';
}
