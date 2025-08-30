import { findUnusedExports } from '@goatjs/ts-unused-exports';
import { prettier } from '@goatjs/node/prettier';

const unused = await findUnusedExports({
  ignoreFiles: ['eslint.config.js'],
  ignoreVars: ['ScreenCaptureParams', 'ffmpeg', 'ffprobe', 'isValidAudioBitrate', 'AudioBitrate', 'Time', 'X11ScreenCapture'],
});

if (unused) {
  throw new Error(
    `The following exports are unused, add them on the ignore or remove the exports to continue.\n${await prettier.format(JSON.stringify(unused), { parser: 'json' })}`,
  );
}
