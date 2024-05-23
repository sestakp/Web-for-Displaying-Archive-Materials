

const ImageFilterSelector = {
  getBrightness: (state) => state.imageFilter.brightness,
  getContrast: (state) => state.imageFilter.contrast,
  getSaturation: (state) => state.imageFilter.saturation,
  gethueRotation: (state) => state.imageFilter.hueRotation,
  getGrayscale: (state) => state.imageFilter.grayScale,
  getInvert: (state) => state.imageFilter.invert,
  getSepia: (state) => state.imageFilter.sepia,
  getFilters: (state) => state.imageFilter,
};
export default ImageFilterSelector;
