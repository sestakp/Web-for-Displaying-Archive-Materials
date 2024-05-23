import ImageStateActions from '../../redux/ImageState/imageStateActions';
import ImageStateSelectors from '../../redux/ImageState/imageStateSelectors';
import WindowStateSelector from '../../redux/windowState/windowStateSelectors';


const mapStateToProps = (state) => {
  return {
    // Map state properties to component props
    position: ImageStateSelectors.getPosition(state),
    isSidePanelOpen: WindowStateSelector.isSidePanelOpen(state),
    isFilterPanelOpen: WindowStateSelector.isFilterPanelOpen(state),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    // Map action creators to component props
    updatePosition: (diff) => dispatch(ImageStateActions.updatePosition(diff)),
  };
};

const Prototype3Connectors = {
  mapStateToProps,
  mapDispatchToProps,
};

export default Prototype3Connectors;
