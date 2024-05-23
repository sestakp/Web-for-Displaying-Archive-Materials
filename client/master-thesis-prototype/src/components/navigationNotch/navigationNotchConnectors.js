import GalleryActions from '../../redux/gallery/galleryActions';
import GallerySelectors from '../../redux/gallery/gallerySelectors';

const mapStateToProps = (state) => {
  return {
    // Map state properties to component props
    galleryProgress: GallerySelectors.getGalleryProgress(state),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    // Map action creators to component props
    moveLeft: () => dispatch(GalleryActions.moveLeft()),
    moveRight: () => dispatch(GalleryActions.moveRight()),
  };
};

const NavigationNotchConnectors = {
  mapStateToProps,
  mapDispatchToProps,
};

export default NavigationNotchConnectors;


