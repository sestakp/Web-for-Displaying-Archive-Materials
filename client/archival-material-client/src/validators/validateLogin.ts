import LoginDto from "../models/User/LoginDto";
import isEmailValid from "../utils/isEmailValid";
import logger from "../utils/loggerUtil";




export default function validateLogin(alrSubmit: boolean, formData: LoginDto, setErrors: React.Dispatch<React.SetStateAction<any>>): boolean{
        

    if( ! alrSubmit){
        return false;
    }

    let hasError = false

    if(formData.email.length < 1){
        setErrors((oldErrors:any) => ({...oldErrors, email: "Email je pro registraci povinný" }))
        hasError = true
    }
    else if( ! isEmailValid(formData.email)){
        setErrors((oldErrors:any) => ({...oldErrors, email: "Formát emailu není platný" }))
        hasError = true
    }
    else{
        setErrors((oldErrors:any) => ({...oldErrors, email: "" }))
    }


    if(formData.password.length < 5){
        setErrors((oldErrors:any) => ({...oldErrors, password: "Heslo musí být dlouhé minimálně 6 znaků" }))
        hasError = true
    }
    else{
        setErrors((oldErrors:any) => ({...oldErrors, password: "" }))
    }

    logger.debug("validateLogin: ", ! hasError)
    return ! hasError;

}