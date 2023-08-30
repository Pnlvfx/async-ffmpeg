export const getProgress = (stderrData: string) => {
  calculateProgress(stderrData);
};

const calculateProgress = (stderrData: string) => {
  const timeMatch = stderrData.match(/time=(\d+:\d+:\d+\.\d+)/);
  if (timeMatch) {
    const currentTime = timeMatch[1];
    console.log(`Conversion progress: ${currentTime}`);
  }
};
