import { NavigateFunction } from "react-router-dom";
import AppThunk from "../types/appThunk";
import Bookmark from "../../models/Bookmark/Bookmark";
import AuthTokenUtil from "../../utils/AuthTokenUtil";
import BookmarkApi from "../../api/BookmarkApi";
import { createAction } from "@reduxjs/toolkit";
import BookmarkTypes from "./bookmarkType";
import handleServerErrors from "../../utils/handleServerErrors";
import toastService from "../../utils/ToastUtil";
import RoutesEnum from "../../layout/RoutesEnum";




const BookmarkAction = {
    upsertBookmark: (navigate: NavigateFunction, url: string, text: string): AppThunk => async (dispatch, getState) => {

        try{
            const state = getState();

            const bookmark = {
                scanUrl: url,
                text: text,
                userId: -1, //hold notes until refresh for not logged user,
                archivalRecordId: state.archivalRecord.detail?.id,
            } as Bookmark;
    
            const currentUser = AuthTokenUtil.getAuthToken();
            if (currentUser != undefined) {
                const newBookmark = await BookmarkApi.upsert(bookmark, currentUser.accessToken);
                bookmark.lastUpdated = newBookmark.lastUpdated;
                toastService.successToast("Záložka úspěšně aktualizována.")
            }
            else{
                toastService.warningToast("Uživatel není přihlášen, záložka po restartu zmizí. Pro uchování záložek se prosím přihlašte.")
            }
    
            return dispatch(createAction<Bookmark>(BookmarkTypes.UPSERT_BOOKMARK)(bookmark))
        }
        catch(error){
            handleServerErrors(navigate, error)
        }
        

    },

    unsetBookmarks: (): AppThunk => async (dispatch) => {
        return dispatch(createAction<Bookmark[]>(BookmarkTypes.SET_BOOKMARKS)([]))
    },

    getBookmarks: (navigate: NavigateFunction, archivalRecordId: number): AppThunk => async (dispatch, getState) => {
        try{
            if (archivalRecordId != undefined) {
    
                const currentUser = AuthTokenUtil.getAuthToken();
                if (currentUser != undefined) {
    
                    const newBookmarks = await BookmarkApi.getBookmarksForArchivalRecord(archivalRecordId, currentUser.accessToken);
                    return dispatch(createAction<Bookmark[]>(BookmarkTypes.SET_BOOKMARKS)(newBookmarks))
    
                }
            }
    
            return undefined;    
        }
        catch(error){
            handleServerErrors(navigate, error);
        }
       
    },

    delete: (navigate: NavigateFunction, bookmarkId: number): AppThunk => async(dispatch) => {

        const currentUser = AuthTokenUtil.getAuthToken();
        if (currentUser != undefined) {
            await BookmarkApi.delete(bookmarkId, currentUser.accessToken);
            toastService.successToast("Záložka úspěšně smazána.")
            return dispatch(createAction<number>(BookmarkTypes.DELETE_BOOKMARK)(bookmarkId))
        }
        else{
            toastService.errorToast("Uživatel není přihlášen.")
            navigate(RoutesEnum.UNAUTHORIZED)
        }
    }

}

export default BookmarkAction;