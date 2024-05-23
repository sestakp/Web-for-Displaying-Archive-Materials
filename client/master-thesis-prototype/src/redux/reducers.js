// src/redux/reducers.js

import { combineReducers } from 'redux';
import WindowStateReducer from './windowState/windowStateReducer';
import ImageStateReducer from './ImageState/imageStateReducer';
import ImageFilterReducer from './ImageFilter/ImageFilterReducer';
import NoteReducer from './note/noteReducer';
import GalleryReducer from './gallery/galleryReducer';
import BookmarkReducer from './bookmark/bookmarkReducer';


const rootReducer = combineReducers({
  // Define your reducers here
  windowState: WindowStateReducer,
  imageState: ImageStateReducer,
  imageFilter: ImageFilterReducer,
  note: NoteReducer,
  gallery: GalleryReducer,
  bookmark: BookmarkReducer,
});

export default rootReducer;
