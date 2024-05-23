

const GallerySelectors = {

  getCurrentImageIndex: (state) => state.gallery.currentImageIndex,
  getImages: (state) => state.gallery.images,
  getCurrentImage: (state) => state.gallery.images[state.gallery.currentImageIndex],
  getGalleryProgress: (state) => `${state.gallery.currentImageIndex + 1} / ${state.gallery.images.length}`,
};

export default GallerySelectors;
