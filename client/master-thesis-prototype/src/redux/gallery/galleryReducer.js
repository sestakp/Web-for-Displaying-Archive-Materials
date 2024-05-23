import GalleryTypes from './galleryTypes';
import logger from '../../utils/loggerUtil';


import image1 from '@assets/matrika-krasny-les/1.jpg';
import image2 from '@assets/matrika-krasny-les/2.jpg';
import image3 from '@assets/matrika-krasny-les/3.jpg';
import image4 from '@assets/matrika-krasny-les/4.jpg';
import image5 from '@assets/matrika-krasny-les/5.jpg';
import image6 from '@assets/matrika-krasny-les/6.jpg';
import image7 from '@assets/matrika-krasny-les/7.jpg';
import image8 from '@assets/matrika-krasny-les/8.jpg';
import image9 from '@assets/matrika-krasny-les/9.jpg';
import image10 from '@assets/matrika-krasny-les/10.jpg';
import image11 from '@assets/matrika-krasny-les/11.jpg';
import image12 from '@assets/matrika-krasny-les/12.jpg';
import image13 from '@assets/matrika-krasny-les/13.jpg';
import image14 from '@assets/matrika-krasny-les/14.jpg';
import image15 from '@assets/matrika-krasny-les/15.jpg';
import image16 from '@assets/matrika-krasny-les/16.jpg';
import image17 from '@assets/matrika-krasny-les/17.jpg';
import image18 from '@assets/matrika-krasny-les/18.jpg';
import image19 from '@assets/matrika-krasny-les/19.jpg';
import image20 from '@assets/matrika-krasny-les/20.jpg';
import image21 from '@assets/matrika-krasny-les/21.jpg';
import image22 from '@assets/matrika-krasny-les/22.jpg';
import image23 from '@assets/matrika-krasny-les/23.jpg';
import image24 from '@assets/matrika-krasny-les/24.jpg';
import image25 from '@assets/matrika-krasny-les/25.jpg';


const INITIAL_STATE = {

  currentImageIndex: 0,
  images: [
    image1,
    image2,
    image3,
    image4,
    image5,
    image6,
    image7,
    image8,
    image9,
    image10,
    image11,
    image12,
    image13,
    image14,
    image15,
    image16,
    image17,
    image18,
    image19,
    image20,
    image21,
    image22,
    image23,
    image24,
    image25,
  ],

};


/**
 * Checks if the given index is within the bounds of the images array in the state.
 *
 * @param {number} index - The index to be checked.
 * @param {Object} state - The state object containing the images array.
 * @return {boolean} True if the index is within bounds, false otherwise.
 */
function indexIsCorrect(index, state) {
  logger.info('indexIsCorrect index: ', index);
  if (index < 0 || index >= state.images.length) {
    logger.warn(`GalleryReducer: passed index: ${index} is out of bound`);
    return false;
  }
  return true;
}

/**
 * Reducer function for managing the gallery state.
 *
 * @param {Object} state - The current state of the gallery.
 * @param {Object} action - The action object describing the update to the state.
 * @param {Object} actions - An object containing various action types used in the reducer.
 * @return {Object} The new state after applying the action.
 */
function GalleryReducer(state = INITIAL_STATE, action, actions) {
  switch (action.type) {
    case GalleryTypes.SET_CURRENT_IMAGE_INDEX:
      if (indexIsCorrect(action.payload, state)) {
        return ({
          ...state,
          currentImageIndex: action.payload,
        });
      }
      return state;
    case GalleryTypes.MOVE:

      logger.info('oldIndex: ', state.currentImageIndex);
      logger.info('newIndex: ', eval(`state.currentImageIndex ${action.payload} 1`));
      const newIndex = eval(`state.currentImageIndex ${action.payload} 1`);

      logger.info('result: ', indexIsCorrect(newIndex, state));
      if (indexIsCorrect(newIndex, state)) {
        return ({
          ...state,
          currentImageIndex: newIndex,
        });
      }
      return state;

    case GalleryTypes.SET_IMAGES:
      return ({
        ...state,
        images: action.payload,
      });

    default:
      return state;
  }

};


export default GalleryReducer;
