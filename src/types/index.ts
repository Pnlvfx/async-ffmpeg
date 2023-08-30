export interface Zoompan {
  zoomIncrement: number;
  maxZoom: number;
  frames: number;
  width: number;
  height: number;
}

export interface VideoFilter {
  zoompan?: Zoompan;
}

export interface FFmpegOptions {
  force?: boolean;
  output: string;
  duration?: number;
  codecAudio?: 'copy';
  loop?: number;
  framerate?: number;
  videoFilter?: string;
  codecVideo?: 'libx264';
  pixelFormat?: 'yuv420p';
}
