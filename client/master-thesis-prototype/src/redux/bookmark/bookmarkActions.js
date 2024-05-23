import BookmarkTypes from './bookmarkTypes';


const BookmarkActions = {

  addBookmark: (bookmark) => ({
    type: BookmarkTypes.ADD_BOOKMARK,
    payload: bookmark,
  }),
};

export default BookmarkActions;
