import { useNavigate } from "react-router-dom";
import LoginDto from "../../../models/User/LoginDto";
import RegisterDto from "../../../models/User/RegisterDto";
import UserUpdateDto from "../../../models/User/UserUpdateDto";
import { useAppDispatch } from "../../hooks";
import UserAction from "../userAction";



const useUserActions = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const login = (login: LoginDto) => dispatch(UserAction.login(navigate, login));
    const register = (register: RegisterDto) => dispatch(UserAction.register(navigate, register));
    const logout = () => dispatch(UserAction.logout());
    const updateUser = (user: UserUpdateDto) => dispatch(UserAction.updateUser(navigate, user));


    return { login, register, logout, updateUser }
}

export default useUserActions;