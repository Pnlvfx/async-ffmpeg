import os from 'node:os';

export const isLinux = os.platform() === 'linux';
