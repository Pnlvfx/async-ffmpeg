// export interface Zoompan {
//   zoomIncrement: number;
//   maxZoom: number;
//   frames: number;
//   width: number;
//   height: number;
// }

// export interface VideoFilter {
//   zoompan?: Zoompan;
// }

export interface Time {
  hours?: number;
  minutes?: number;
  seconds?: number;
  milliseconds?: number;
}

/**
 * Options for configuring FFmpeg commands.
 */
export interface FFmpegParams {
  /** Input file path. Equivalent to the `-i` option in FFmpeg. */
  input: string | string[];

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

  /** Add any extra parameter. Don't need to be used at the end.*/
  extra?: string[];

  /** Whetever process or not the video. Default: false.*/
  noVideo?: boolean;
}
