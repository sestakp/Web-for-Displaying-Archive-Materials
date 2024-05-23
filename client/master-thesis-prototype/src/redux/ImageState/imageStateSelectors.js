

const ImageStateSelectors = {
  getImageRotation: (state) => state.imageState.rotation,
  isLocked: (state) => state.imageState.isLocked,
  getPosition: (state) => state.imageState.position,
};

export default ImageStateSelectors;
