/** @internal */
export const getProgress = (stderrData: string) => {
  calculateProgress(stderrData);
};

const calculateProgress = (stderrData: string) => {
  const timeMatch = stderrData.match(/time=(\d+:\d+:\d+\.\d+)/);
  if (timeMatch) {
    const currentTime = timeMatch[1];
    // eslint-disable-next-line no-console
    console.log(`Conversion progress: ${currentTime}`);
  }
};
