import GalleryActions from '../../redux/gallery/galleryActions';


const mapStateToProps = (state) => {
  return {
    // Map state properties to component props
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    // Map action creators to component props
    setCurrentImageIndex: (newIndex) => dispatch(GalleryActions.setCurrentImageIndex(newIndex)),
  };
};

const BookmarkPanelConnectors = {
  mapStateToProps,
  mapDispatchToProps,
};

export default BookmarkPanelConnectors;
