import { findUnusedExports } from '@goatjs/ts-unused-exports';

const unused = await findUnusedExports({
  ignoreFiles: ['ffmpeg.ts', 'eslint.config.js'],
  ignoreVars: ['ScreenCaptureParams'],
});

if (unused) {
  throw new Error(`The following exports are unused, add them on the ignore or remove the exports to continue.\n${JSON.stringify(unused)}`);
}
