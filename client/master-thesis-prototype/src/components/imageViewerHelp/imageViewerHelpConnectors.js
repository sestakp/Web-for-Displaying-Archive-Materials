import WindowStateActions from '../../redux/windowState/windowStateActions';
import WindowStateSelector from '../../redux/windowState/windowStateSelectors';

const mapStateToProps = (state) => {
  console.log();
  return {
    // Map state properties to component props
    isHelpModalOpen: WindowStateSelector.isHelpModalOpen(state),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    // Map action creators to component props
    toggleHelpModalOpen: () => dispatch(WindowStateActions.toggleHelpModalOpen()),
  };
};

const ImageViewerHelpConnectors = {
  mapStateToProps,
  mapDispatchToProps,
};

export default ImageViewerHelpConnectors;
