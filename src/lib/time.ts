/** @internal */
export const parseDuration = (seconds: number) => {
  if (Number.isNaN(seconds) || seconds < 0) throw new Error('Invalid duration');
  const hours = Math.floor(seconds / 3600)
    .toString()
    .padStart(2, '0');
  const minutes = Math.floor((seconds % 3600) / 60)
    .toString()
    .padStart(2, '0');
  const _seconds = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0');
  const milliseconds = Math.floor((seconds % 1) * 1000)
    .toString()
    .padStart(3, '0');
  return `${hours}:${minutes}:${_seconds}.${milliseconds}`;
};

/** @internal */
export const parseDurationNum = (seconds: number) => {
  if (Number.isNaN(seconds) || seconds < 0) throw new Error('Invalid duration');
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const _seconds = Math.floor(seconds % 60);
  const milliseconds = Math.floor((seconds % 1) * 1000);
  return {
    hours,
    minutes,
    seconds: _seconds,
    milliseconds,
  };
};
