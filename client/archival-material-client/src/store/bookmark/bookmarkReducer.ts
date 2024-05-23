import { AnyAction } from "@reduxjs/toolkit";
import BookmarkState from "./bookmarkState/bookmarkStateInterface";
import bookmarkDefaultState from "./bookmarkState/bookmarkDefaultState";
import BookmarkTypes from "./bookmarkType";





const bookmarkReducer = (state: BookmarkState = bookmarkDefaultState, action: AnyAction): BookmarkState => {


    switch (action.type) {
        case BookmarkTypes.SET_BOOKMARKS:
            return { ...state, data: action.payload }

        case BookmarkTypes.UPSERT_BOOKMARK:
            
            // Check if a note with the same scanUrl and userId already exists
            const existingBookmarkIndex = state.data.findIndex(
                bookmark => bookmark.scanUrl === action.payload.scanUrl
            );

            if (existingBookmarkIndex !== -1) {
                // Note already exists, update the existing note
                const updatedData = [...state.data];
                updatedData[existingBookmarkIndex] = action.payload;

                return { ...state, data: updatedData };
            } else {
                // Note doesn't exist, add the new note
                return { ...state, data: [...state.data, action.payload] };
            }
        
        case BookmarkTypes.DELETE_BOOKMARK:
            return { ...state, data: state.data.filter(bookmark => bookmark.id != action.payload) }

        default:
            return state;
    }

}

export default bookmarkReducer;