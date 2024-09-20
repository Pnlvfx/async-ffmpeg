/** @internal */
export const getProgress = (stderrData: string) => {
  calculateProgress(stderrData);
};

const calculateProgress = (stderrData: string) => {
  const timeMatch = /time=(\d+:\d+:\d+\.\d+)/.exec(stderrData)?.at(1);
  if (timeMatch) {
    // eslint-disable-next-line no-console
    console.log(`Conversion progress: ${timeMatch.toString()}`);
  }
};
