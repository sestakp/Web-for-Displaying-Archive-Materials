import CurrentUser from "../../../models/User/CurrentUser";




export default interface UserState {
    currentUser: CurrentUser | undefined
}