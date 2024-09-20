export interface FfprobeData {
  streams: FfprobeStream[];
  format: FfprobeFormat;
  chapters: unknown[];
}

export interface FfprobeStream {
  [key: string]: unknown;
  index: number;
  codec_name?: string;
  codec_long_name?: string;
  profile?: number;
  codec_type?: string;
  codec_time_base?: string;
  codec_tag_string?: string;
  codec_tag?: string;
  width?: number;
  height?: number;
  coded_width?: number;
  coded_height?: number;
  has_b_frames?: number;
  sample_aspect_ratio?: string;
  display_aspect_ratio?: string;
  pix_fmt?: string;
  level?: string;
  color_range?: string;
  color_space?: string;
  color_transfer?: string;
  color_primaries?: string;
  chroma_location?: string;
  field_order?: string;
  timecode?: string;
  refs?: number;
  id?: string;
  r_frame_rate?: string;
  avg_frame_rate?: string;
  time_base?: string;
  start_pts?: number;
  start_time?: number;
  duration_ts?: string;
  duration?: string;
  bit_rate?: string;
  max_bit_rate?: string;
  bits_per_raw_sample?: string;
  nb_frames?: string;
  nb_read_frames?: string;
  nb_read_packets?: string;
  sample_fmt?: string;
  sample_rate?: number;
  channels?: number;
  channel_layout?: string;
  bits_per_sample?: number;
  disposition?: FfprobeStreamDisposition;
  rotation?: string | number;
}

interface FfprobeStreamDisposition {
  [key: string]: unknown;
  default?: number;
  dub?: number;
  original?: number;
  comment?: number;
  lyrics?: number;
  karaoke?: number;
  forced?: number;
  hearing_impaired?: number;
  visual_impaired?: number;
  clean_effects?: number;
  attached_pic?: number;
  timed_thumbnails?: number;
}

export interface FfprobeFormat {
  [key: string]: unknown;
  filename?: string;
  nb_streams?: number;
  nb_programs?: number;
  format_name?: string;
  format_long_name?: string;
  start_time?: number;
  duration?: number;
  size?: number;
  bit_rate?: number;
  probe_score?: number;
  tags?: Record<string, string | number>;
}
