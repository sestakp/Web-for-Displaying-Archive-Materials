import axios from "axios";
import LoginDto from "../models/User/LoginDto";
import RegisterDto from "../models/User/RegisterDto";
import CurrentUser from "../models/User/CurrentUser";
import UserUpdateDto from "../models/User/UserUpdateDto";
import PasswordResetDto from "../models/User/PasswordResetDto";

const baseUrl = process.env.REACT_APP_API_URL + "/users";


const UserApi = {

    login: async(login: LoginDto): Promise<CurrentUser> => {
        const response = await axios.post(baseUrl + "/login",login, {
            headers: {
                'Content-Type': 'application/json'
            },
        })

        return response.data;
    },

    register: async(register: RegisterDto): Promise<any> => {
        
        register.passwordAgain = ""

        const response = await axios.post(baseUrl + "/register", register, {
            headers: {
                'Content-Type': 'application/json'
            },
        })

        return response.data;
    },

    updateUser: async(userUpdateDto: UserUpdateDto, token: string): Promise<void> => {
        await axios.put(baseUrl, userUpdateDto, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        })

    },

    addToFavourites: async(archivalRecordId: number, token: string): Promise<void> => {
        await axios.post(baseUrl+"/favourite/"+archivalRecordId, undefined, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        })
    },

    removeFromFavourites: async(archivalRecordId: number, token: string): Promise<void> => {
        await axios.delete(baseUrl+"/favourite/"+archivalRecordId, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        })
    },


    sendPasswordResetRequest: async(email: string): Promise<void> => {
        await axios.get(baseUrl+"/password-reset/"+email)
    },

    resetPassword: async(passwordResetDto: PasswordResetDto): Promise<void> => {
        await axios.put(baseUrl+"/password-reset", passwordResetDto, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
    }
}


export default UserApi
