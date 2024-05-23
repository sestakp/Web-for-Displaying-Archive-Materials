import ImageStateActions from '../ImageState/imageStateActions';
import ImageStateSelectors from '../ImageState/imageStateSelectors';
import GalleryTypes from './galleryTypes';


const GalleryActions = {

  setCurrentImageIndex: (index) => (dispatch, getState) => {
    const state = getState();
    if (ImageStateSelectors.isLocked(state)) {
      dispatch(ImageStateActions.reset());
    }

    dispatch({
      type: GalleryTypes.SET_CURRENT_IMAGE_INDEX,
      payload: index,
    });
  },


  setImages: (images) => ({
    type: GalleryTypes.SET_IMAGES,
    payload: images,
  }),


  moveRight: () => (dispatch, getState) => {
    const state = getState();
    if (ImageStateSelectors.isLocked(state)) {
      dispatch(ImageStateActions.reset());
    }

    dispatch({
      type: GalleryTypes.MOVE,
      payload: '+',
    });
  },

  moveLeft: () => (dispatch, getState) => {
    const state = getState();
    if (ImageStateSelectors.isLocked(state)) {
      dispatch(ImageStateActions.reset());
    }

    dispatch({
      type: GalleryTypes.MOVE,
      payload: '-',
    });
  },

};

export default GalleryActions;
