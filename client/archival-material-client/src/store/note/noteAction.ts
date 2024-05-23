import { createAction } from "@reduxjs/toolkit";
import AppThunk from "../types/appThunk";
import Note from "../../models/Note/Note";
import NoteType from "./noteType";
import NoteApi from "../../api/NoteApi";
import AuthTokenUtil from "../../utils/AuthTokenUtil";
import { NavigateFunction, useNavigate } from "react-router-dom";
import handleServerErrors from "../../utils/handleServerErrors";
import toastService from "../../utils/ToastUtil";
import AccessibilityEnum from "../../models/AccessibilityEnum";








const NoteAction = {

    upsertNote: (navigate: NavigateFunction, url: string, data: string, accessibility: AccessibilityEnum): AppThunk => async (dispatch, getState) => {

        try{
            const state = getState();
            console.log("detail id: ", state.archivalRecord.detail?.id)
            const note = {
                scanUrl: url,
                data: data,
                userId: -1, //hold notes until refresh for not logged user,
                archivalRecordId: state.archivalRecord.detail?.id,
                accessibility: accessibility
            } as Note;
            
            console.log("upserting note: ", note);
            const currentUser = AuthTokenUtil.getAuthToken();
            if (currentUser != undefined) {
                await NoteApi.upsert(note, currentUser.accessToken);
            }
            else{
                toastService.warningToast("Uživatel není přihlášen, poznámky po restartu zmizí. Pro uchování poznámek se prosím přihlašte")
            }
    
            return dispatch(createAction<Note>(NoteType.UPSERT_NOTE)(note))
        }
        catch(error){
            handleServerErrors(navigate, error)
        }
        

    },

    unsetNotes: (): AppThunk => async (dispatch) => {
        return dispatch(createAction<Note[]>(NoteType.SET_NOTES)([]))
    },

    getNotes: (navigate: NavigateFunction, archivalRecordId: number): AppThunk => async (dispatch, getState) => {
        try{    
            if (archivalRecordId != undefined) {
                const currentUser = AuthTokenUtil.getAuthToken();
                const newNotes = await NoteApi.getNotesForArchivalRecord(archivalRecordId, currentUser?.accessToken);
                return dispatch(createAction<Note[]>(NoteType.SET_NOTES)(newNotes))
            }
    
            return undefined;    
        }
        catch(error){
            handleServerErrors(navigate, error);
        }
       
    }

}

export default NoteAction;