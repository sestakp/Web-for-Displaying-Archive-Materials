import { AnyAction } from "redux";
import userDefaultState from "./userState/userDefaultState";
import UserState from "./userState/userStateInterface";
import UserTypes from "./userType";
import logger from "../../utils/loggerUtil";


const userReducer = (state: UserState = userDefaultState, action: AnyAction): UserState => {
    
    switch (action.type) {
    
        case UserTypes.SET_USER:
            return { ...state, currentUser: action.payload}
        
        case UserTypes.LOGOUT:
            return { ...state, currentUser: undefined }

        case UserTypes.UPDATE_USER:
            logger.debug("reducer update user: ", action.payload)
            return { ...state, currentUser: {...state.currentUser, ...action.payload }}
    }

    return state;
}

export default userReducer;