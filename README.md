# async-ffmpeg

Node interaction with ffmpeg in Node.js promise style.

[![npm version](https://img.shields.io/npm/v/async-ffmpeg.svg)](https://www.npmjs.com/package/async-ffmpeg)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Installation

```bash
npm install async-ffmpeg
```

```bash
yarn add async-ffmpeg
```

## Prerequisites

Make sure you have `ffmpeg` and `ffprobe` installed on your system:

- **Ubuntu/Debian**: `sudo apt install ffmpeg`
- **macOS**: `brew install ffmpeg`
- **Windows**: Download from [ffmpeg.org](https://ffmpeg.org/download.html)

## Usage

### Basic FFmpeg Operations

```javascript
import { ffmpeg } from 'async-ffmpeg';

// Basic video conversion
await ffmpeg({
  input: 'input.mp4',
  output: 'output.avi',
  videoCodec: 'libx264',
});

// Convert with specific parameters
await ffmpeg({
  input: 'input.mov',
  output: 'output.mp4',
  videoCodec: 'libx264',
  audioCodec: 'aac',
  audioBitrate: '128k',
  videoFilter: 'scale=1920:1080',
});
```

### FFprobe - Media Information

```javascript
import { ffprobe } from 'async-ffmpeg/ffprobe';

// Get media information
const mediaInfo = await ffprobe('video.mp4');
console.log('Duration:', mediaInfo.format.duration);
console.log(
  'Video streams:',
  mediaInfo.streams.filter((s) => s.codec_type === 'video'),
);
console.log(
  'Audio streams:',
  mediaInfo.streams.filter((s) => s.codec_type === 'audio'),
);

// Works with streams too
import { createReadStream } from 'fs';
const stream = createReadStream('video.mp4');
const streamInfo = await ffprobe(stream);
```

### Screen Capture (Linux)

```javascript
import { X11ScreenCapture } from 'async-ffmpeg/screen-capture';

const screenCapture = X11ScreenCapture({
  display: ':0',
  width: 1920,
  height: 1080,
  framerate: 30,
  x: 0,
  y: 0,
  output: 'screen-recording.mp4',
});

// Start recording
await screenCapture.startRecording();

// Stop after 10 seconds
setTimeout(async () => {
  await screenCapture.stopRecording();
}, 10000);
```

## API Reference

### ffmpeg(params)

Main function for executing FFmpeg operations.

#### Parameters

| Parameter       | Type                 | Description                              |
| --------------- | -------------------- | ---------------------------------------- |
| `input`         | `string \| Readable` | Input file path or readable stream       |
| `output`        | `string`             | Output file path                         |
| `audio`         | `string`             | Additional audio input file              |
| `audioCodec`    | `string`             | Audio codec (e.g., 'aac', 'mp3', 'flac') |
| `audioBitrate`  | `string \| number`   | Audio bitrate (e.g., '128k' or 128)      |
| `videoCodec`    | `string`             | Video codec (e.g., 'libx264', 'libx265') |
| `codec`         | `string`             | General codec setting                    |
| `duration`      | `Time`               | Duration to process                      |
| `framerate`     | `number`             | Video framerate                          |
| `inputSeeking`  | `Time`               | Seek to position in input                |
| `outputSeeking` | `Time`               | Seek to position in output               |
| `videoFilter`   | `string`             | Video filter string                      |
| `pixelFormat`   | `string`             | Pixel format (e.g., 'yuv420p')           |
| `map`           | `string \| string[]` | Stream mapping                           |
| `videoFrames`   | `number`             | Number of video frames to output         |
| `loop`          | `number`             | Loop input                               |
| `noVideo`       | `boolean`            | Disable video output                     |
| `outputFormat`  | `string`             | Output format                            |
| `logLevel`      | `string`             | FFmpeg log level                         |
| `extra`         | `string[]`           | Additional FFmpeg parameters             |
| `debug`         | `boolean`            | Enable debug output                      |

#### Time Format

The `Time` type accepts:

- Numbers (seconds): `30`, `120.5`
- Time strings: `'00:01:30'`, `'1:30'`, `'90'`

### ffprobe(input)

Get detailed information about media files.

#### Parameters

| Parameter | Type               | Description                  |
| --------- | ------------------ | ---------------------------- |
| `input`   | `string \| Stream` | File path or readable stream |

#### Returns

Returns a `FfprobeData` object containing:

- `streams`: Array of stream information
- `format`: Format information (duration, bitrate, etc.)
- `chapters`: Chapter information

### X11ScreenCapture(params)

Screen capture functionality for Linux systems.

#### Parameters

| Parameter   | Type     | Description                 |
| ----------- | -------- | --------------------------- |
| `display`   | `string` | Display number (e.g., ':0') |
| `width`     | `number` | Capture width               |
| `height`    | `number` | Capture height              |
| `framerate` | `number` | Recording framerate         |
| `x`         | `number` | X position to start capture |
| `y`         | `number` | Y position to start capture |
| `output`    | `string` | Output file path            |

#### Returns

Object with methods:

- `startRecording()`: Start screen recording
- `stopRecording()`: Stop screen recording

## Examples

### Video Processing

```javascript
// Extract audio from video
await ffmpeg({
  input: 'video.mp4',
  output: 'audio.mp3',
  noVideo: true,
  audioCodec: 'mp3',
});

// Create thumbnail
await ffmpeg({
  input: 'video.mp4',
  output: 'thumbnail.jpg',
  inputSeeking: '00:00:10',
  videoFrames: 1,
});

// Resize video
await ffmpeg({
  input: 'input.mp4',
  output: 'resized.mp4',
  videoFilter: 'scale=640:480',
  videoCodec: 'libx264',
});
```

### Working with Streams

```javascript
import { createReadStream, createWriteStream } from 'fs';

// Process stream input
const inputStream = createReadStream('input.mp4');
await ffmpeg({
  input: inputStream,
  output: 'output.mp4',
  videoCodec: 'libx264',
});
```

### Advanced Usage

```javascript
// Multiple inputs with mapping
await ffmpeg({
  input: 'video.mp4',
  audio: 'audio.mp3',
  output: 'combined.mp4',
  map: ['0:v:0', '1:a:0'], // Use video from first input, audio from second
  videoCodec: 'libx264',
  audioCodec: 'aac',
});

// Custom filters and parameters
await ffmpeg({
  input: 'input.mp4',
  output: 'filtered.mp4',
  videoFilter: 'scale=1920:1080,fps=30',
  extra: ['-preset', 'fast', '-crf', '23'],
  debug: true, // Show FFmpeg command
});
```

## Error Handling

All functions return promises, so use try/catch for error handling:

```javascript
try {
  await ffmpeg({
    input: 'input.mp4',
    output: 'output.mp4',
  });
  console.log('Conversion completed successfully');
} catch (error) {
  console.error('FFmpeg error:', error.message);
}
```

## TypeScript Support

The package includes full TypeScript definitions:

```typescript
import { ffmpeg, ffprobe, type FFmpegParams, type FfprobeData } from 'async-ffmpeg';

const params: FFmpegParams = {
  input: 'input.mp4',
  output: 'output.mp4',
  videoCodec: 'libx264',
};

const mediaInfo: FfprobeData = await ffprobe('video.mp4');
```

## Requirements

- Node.js 14+ (ES modules support)
- FFmpeg installed and accessible in PATH
- Linux system for screen capture functionality

## License

MIT © [Simone Gauli](mailto:simonegauli@gmail.com)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Repository

[https://github.com/Pnlvfx/async-ffmpeg](https://github.com/Pnlvfx/async-ffmpeg)
