import ImageStateActions from '../../redux/ImageState/imageStateActions';
import ImageStateSelectors from '../../redux/ImageState/imageStateSelectors';
import GallerySelectors from '../../redux/gallery/gallerySelectors';
import NoteActions from '../../redux/note/noteActions';
import WindowStateActions from '../../redux/windowState/windowStateActions';

const mapStateToProps = (state) => {
  console.log();
  return {
    // Map state properties to component props
    isLocked: ImageStateSelectors.isLocked(state),
    currentImage: GallerySelectors.getCurrentImage(state),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    // Map action creators to component props
    rotateLeft: () => dispatch(ImageStateActions.rotateLeft()),
    rotateRight: () => dispatch(ImageStateActions.rotateRight()),
    toggleLock: () => dispatch(ImageStateActions.toggleLock()),
    reset: () => dispatch(ImageStateActions.reset()),
    toggleSidebar: () => dispatch(WindowStateActions.toggleSidePanelOpen()),
    toggleNoteLayerVisibility: () => dispatch(NoteActions.toggleNoteLayerVisibility()),
    toggleHelpModalOpen: () => dispatch(WindowStateActions.toggleHelpModalOpen()),
    toggleFilterPanelOpen: () => dispatch(WindowStateActions.toggleFilterPanelOpen()),
  };
};

const ControlMenuConnectors = {
  mapStateToProps,
  mapDispatchToProps,
};

export default ControlMenuConnectors;
