import { NavigateFunction } from "react-router-dom";
import AppThunk from "../types/appThunk";
import { createAction } from "@reduxjs/toolkit";
import LoadingStatusEnum from "../../models/LoadingStatusEnum";
import ArchiveType from "./archiveType";
import ArchiveApi from "../../api/ArchiveApi";
import handleServerErrors from "../../utils/handleServerErrors";
import Archive from "../../models/Archive/Archive";





const ArchiveAction = {

    fetchArchives: (navigate: NavigateFunction): AppThunk => async(dispatch, getState) => {
        try{
            const state = getState();

            if( state.archive.data.length > 0){
                return state.archive.data;
            }

            dispatch(createAction<LoadingStatusEnum>(ArchiveType.SET_STATUS)(LoadingStatusEnum.LOADING))
    
            var archives = await ArchiveApi.getAllArchives();
            
            await dispatch(createAction<Archive[]>(ArchiveType.SET_DATA)(archives))
            
            dispatch(createAction<LoadingStatusEnum>(ArchiveType.SET_STATUS)(LoadingStatusEnum.IDLE))
    
            return archives;
        }
        catch(error){
            handleServerErrors(navigate, error);
        }
    },
}


export default ArchiveAction;