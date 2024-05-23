import BookmarkTypes from './bookmarkTypes';

const INITIAL_STATE = {


};

/**
 * Bookmark reducer function.
 *
 * @param {Object} state - The current state.
 * @param {Object} action - The action object.
 * @param {Object} actions - The actions object.
 * @returns {Object} The new state.
 */
function BookmarkReducer(state = INITIAL_STATE, action, actions) {
  switch (action.type) {
    case BookmarkTypes.ADD_BOOKMARK:
      return ({
        ...state,
      });

    default:
      return state;
  }

};


export default BookmarkReducer;
