import CurrentUser from "../../models/User/CurrentUser";
import AuthTokenUtil from "../../utils/AuthTokenUtil";
import RootState from "../types/rootState";




const UserSelector = {

    getUser: (state: RootState): CurrentUser | undefined => {
        
        let user = state.user.currentUser

        if(user == undefined){
            user = AuthTokenUtil.getAuthToken();
        }

        return user
    },
}

export default UserSelector;