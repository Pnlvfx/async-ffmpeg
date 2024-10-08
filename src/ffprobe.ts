import type { FfprobeData, FfprobeStream } from './types/ffprobe.js';
import { spawn } from 'node:child_process';
import { Stream } from 'node:stream';

const parseFfprobeOutput = (out: string): FfprobeData => {
  let lines = out.split(/\r\n|\r|\n/);
  lines = lines.filter((line) => line.length > 0);

  const data: FfprobeData = {
    streams: [],
    format: {},
    chapters: [],
  };

  const parseBlock = (name: string) => {
    const data2: Record<string, string | number> = {};

    let line = lines.shift();
    while (line !== undefined) {
      if (line.toLowerCase() == '[/' + name + ']') {
        return data2;
      } else if (line.startsWith('[')) {
        line = lines.shift();
        continue;
      }

      const kv = /^([^=]+)=(.*)$/.exec(line);
      const rgx1 = kv?.at(1);
      const rgx2 = kv?.at(2);
      if (rgx1 && rgx2) {
        data2[rgx1] = !rgx1.startsWith('TAG:') && /^\d+(\.\d+)?$/.test(rgx2) ? Number(rgx2) : rgx2;
      }

      line = lines.shift();
    }

    return data2;
  };

  let line = lines.shift();
  while (line !== undefined) {
    if (/^\[stream/i.test(line)) {
      const stream = parseBlock('stream');
      data.streams.push(stream as FfprobeStream);
    } else if (/^\[chapter/i.test(line)) {
      const chapter = parseBlock('chapter');
      data.chapters.push(chapter);
    } else if (line.toLowerCase() === '[format]') {
      data.format = parseBlock('format');
    }

    line = lines.shift();
  }

  return data;
};

export const ffprobe = async (file: string | Stream) => {
  return new Promise<FfprobeData>((resolve, reject) => {
    const isStream = file instanceof Stream;
    const src = isStream ? 'pipe:0' : file;
    // eslint-disable-next-line sonarjs/no-os-command-from-path
    const ffprobeProcess = spawn('ffprobe', ['-show_streams', '-show_format', src], { windowsHide: true });

    let stdout = '';
    let stderr = '';

    ffprobeProcess.on('error', reject);

    ffprobeProcess.stdout.on('data', (data: Buffer) => {
      stdout += data.toString();
    });

    ffprobeProcess.stderr.on('data', (data: Buffer) => {
      stderr += data.toString();
    });

    // eslint-disable-next-line sonarjs/cognitive-complexity
    ffprobeProcess.on('close', (code) => {
      if (code === 0) {
        const data = parseFfprobeOutput(stdout);
        for (const target of [data.format, ...data.streams]) {
          const legacyTagKeys = Object.keys(target).filter((key: string) => /^TAG:/.exec(key));
          if (legacyTagKeys.length > 0) {
            target.tags = target.tags ?? {};

            for (const tagKey of legacyTagKeys) {
              target.tags[tagKey.slice(4)] = target[tagKey];
              // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
              delete target[tagKey];
            }
          }

          const legacyDispositionKeys = Object.keys(target).filter((key: string) => /^DISPOSITION:/.exec(key));

          if (legacyDispositionKeys.length > 0) {
            target.disposition = target.disposition ?? {};

            for (const dispositionKey of legacyDispositionKeys) {
              target.disposition[dispositionKey.slice(12)] = target[dispositionKey];
              // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
              delete target[dispositionKey];
            }
          }
        }
        resolve(data);
      } else reject(new Error(stderr));
    });
  });
};
