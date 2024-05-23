import { createAction } from "@reduxjs/toolkit";
import UserApi from "../../api/UserApi";
import LoginDto from "../../models/User/LoginDto";
import RegisterDto from "../../models/User/RegisterDto";
import AuthTokenUtil from "../../utils/AuthTokenUtil";
import AppThunk from "../types/appThunk";
import CurrentUser from "../../models/User/CurrentUser";
import UserTypes from "./userType";
import toastService from "../../utils/ToastUtil";
import UserUpdateDto from "../../models/User/UserUpdateDto";
import logger from "../../utils/loggerUtil";
import NoteAction from "../note/noteAction";
import { NavigateFunction } from "react-router-dom";
import handleServerErrors from "../../utils/handleServerErrors";
import BookmarkAction from "../bookmark/bookmarkActions";



const login = (navigate: NavigateFunction, login: LoginDto): AppThunk => async(dispatch, getState) => {
        
    try{
        var currentUser = await UserApi.login(login);
    
        AuthTokenUtil.setAuthToken(currentUser)

        dispatch(createAction<CurrentUser>(UserTypes.SET_USER)(currentUser))
        
        
        toastService.successToast("Přihlášení úspěšné")
    }
    catch(error){
        handleServerErrors(navigate, error);
    }

}

const logout = (): AppThunk => async(dispatch, getState) => {
    logger.debug("LOGOUT")
    AuthTokenUtil.removeAuthToken();
    dispatch(NoteAction.unsetNotes());
    dispatch(BookmarkAction.unsetBookmarks());

    dispatch(createAction(UserTypes.LOGOUT)())

}

const register = (navigate: NavigateFunction, register: RegisterDto): AppThunk => async(dispatch, getState) => {
    try{
        await UserApi.register(register);
    }
    catch(error){
        handleServerErrors(navigate, error);
    }

}

const updateUser = (navigate: NavigateFunction, user: UserUpdateDto): AppThunk => async(dispatch) => {

    const currentUser = AuthTokenUtil.getAuthToken();
    if(currentUser?.accessToken != undefined){
        
        try{
            await UserApi.updateUser(user, currentUser.accessToken)
        
        
            dispatch(createAction<UserUpdateDto>(UserTypes.UPDATE_USER)(user))
            
            toastService.successToast("Údaje úspěšně aktualizovány")

            if(user.email != undefined){
                dispatch(logout())
            }
        }
        catch(error){
            handleServerErrors(navigate, error);
        }

    }
}

const UserAction = {
    login,
    logout,
    register,
    updateUser
}

export default UserAction;