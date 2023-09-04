/**
 * @internal
 */
export const VideoFilter = {
  Zoompan: {
    zoomInAtCenter: (width: number, height: number, { maxZoom = 1.5, zoomIncrement = 0.0015 } = {}) => {
      const scaleW = width >= height ? 8000 : 4000;
      const scaleH = height >= width ? 8000 : 4000;
      return `[0:v]scale=${scaleW}x${scaleH},zoompan=z='min(pzoom+${zoomIncrement},${maxZoom})':d=1:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=${width}x${height}`;
    },
  },
};
