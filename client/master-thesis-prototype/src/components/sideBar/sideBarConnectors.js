import GalleryActions from '../../redux/gallery/galleryActions';
import GallerySelectors from '../../redux/gallery/gallerySelectors';
import WindowStateSelector from '../../redux/windowState/windowStateSelectors';


const mapStateToProps = (state) => {
  return {
    // Map state properties to component props
    isSidePanelOpen: WindowStateSelector.isSidePanelOpen(state),
    currentImageIndex: GallerySelectors.getCurrentImageIndex(state),
    images: GallerySelectors.getImages(state),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    // Map action creators to component props
    setCurrentImageIndex: (newIndex) => dispatch(GalleryActions.setCurrentImageIndex(newIndex)),
  };
};

const SideBarConnectors = {
  mapStateToProps,
  mapDispatchToProps,
};

export default SideBarConnectors;
