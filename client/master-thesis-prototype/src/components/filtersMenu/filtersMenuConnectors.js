import WindowStateSelector from '../../redux/windowState/windowStateSelectors';
import ImageFilterSelector from '../../redux/ImageFilter/ImageFilterSelectors';
import ImageFilterActions from '../../redux/ImageFilter/ImageFilterActions';

const mapStateToProps = (state) => {
  console.log();
  return {
    // Map state properties to component props

    isFilterPanelOpen: WindowStateSelector.isFilterPanelOpen(state),
    brightness: ImageFilterSelector.getBrightness(state),
    contrast: ImageFilterSelector.getContrast(state),
    saturation: ImageFilterSelector.getSaturation(state),
    hueRotation: ImageFilterSelector.gethueRotation(state),
    grayScale: ImageFilterSelector.getGrayscale(state),
    invert: ImageFilterSelector.getInvert(state),
    sepia: ImageFilterSelector.getSepia(state),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    // Map action creators to component props
    setBrightness: (e) => dispatch(ImageFilterActions.setBrightness(e.value)),
    setContrast: (e) => dispatch(ImageFilterActions.setContrast(e.value)),
    setSaturation: (e) => dispatch(ImageFilterActions.setSaturation(e.value)),
    sethueRotation: (e) => dispatch(ImageFilterActions.sethueRotation(e.value)),
    setGrayScale: (e) => dispatch(ImageFilterActions.setGrayScale(e.value)),
    setInvert: (e) => dispatch(ImageFilterActions.setInvert(e.value)),
    setSepia: (e) => dispatch(ImageFilterActions.setSepia(e.value)),
    resetFilters: () => dispatch(ImageFilterActions.reset()),

  };
};

const FiltersMenuConnectors = {
  mapStateToProps,
  mapDispatchToProps,
};

export default FiltersMenuConnectors;
