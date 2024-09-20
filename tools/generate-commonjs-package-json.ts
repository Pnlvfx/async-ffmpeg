import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

mkdirSync(path.dirname(process.argv[2]), { recursive: true });
writeFileSync(process.argv[2], `{"type": "commonjs"}`);
