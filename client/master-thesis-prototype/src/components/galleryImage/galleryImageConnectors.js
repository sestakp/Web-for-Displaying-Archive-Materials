import ImageFilterSelector from '../../redux/ImageFilter/ImageFilterSelectors';
import ImageStateSelectors from '../../redux/ImageState/imageStateSelectors';
import GallerySelectors from '../../redux/gallery/gallerySelectors';


const mapStateToProps = (state) => {
  return {
    // Map state properties to component props
    brightness: ImageFilterSelector.getBrightness(state),
    contrast: ImageFilterSelector.getContrast(state),
    grayScale: ImageFilterSelector.getGrayscale(state),
    invert: ImageFilterSelector.getInvert(state),
    saturation: ImageFilterSelector.getSaturation(state),
    sepia: ImageFilterSelector.getSepia(state),
    hueRotation: ImageFilterSelector.gethueRotation(state),


    rotation: ImageStateSelectors.getImageRotation(state),
    currentImage: GallerySelectors.getCurrentImage(state),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    // Map action creators to component props
  };
};

const GalleryImageConnectors = {
  mapStateToProps,
  mapDispatchToProps,
};

export default GalleryImageConnectors;
