import RegisterDto from "../models/User/RegisterDto";
import isEmailValid from "../utils/isEmailValid";
import logger from "../utils/loggerUtil";



export default function validateRegistration(alrSubmit: boolean, formData: RegisterDto, setErrors: React.Dispatch<React.SetStateAction<any>>): boolean{
        
    if( ! alrSubmit){
        return false;
    }

    let hasError = false

    logger.debug("formdata: ", formData.name.length)
    if(formData.name.length < 1){
        setErrors((oldErrors: any) => ({...oldErrors, name: "Jméno nebo přezdívka je pro registraci povinná" }))
        logger.debug("error in name")
        hasError = true
    }
    else if(formData.name.length > 255){
        setErrors((oldErrors: any) => ({...oldErrors, name: "Jméno nebo přezdívka může obsahovat maximálně 255 znaků" }))
        hasError = true
    }
    else{
        setErrors((oldErrors: any) => ({...oldErrors, name: "" }))
    }


    if(formData.email.length < 1){
        setErrors((oldErrors: any) => ({...oldErrors, email: "Email je pro registraci povinný" }))
        hasError = true
    }
    else if( ! isEmailValid(formData.email)){
        setErrors((oldErrors: any) => ({...oldErrors, email: "Formát emailu není platný" }))
        hasError = true
    }
    else{
        setErrors((oldErrors: any) => ({...oldErrors, email: "" }))
    }


    if(formData.password.length < 5){
        setErrors((oldErrors: any) => ({...oldErrors, password: "Heslo musí být dlouhé minimálně 6 znaků" }))
        hasError = true
    }
    else{
        setErrors((oldErrors: any) => ({...oldErrors, password: "" }))
    }


    if(formData.password != formData.passwordAgain){
        setErrors((oldErrors: any) => ({...oldErrors, passwordAgain: "Hesla se musí shodovat" }))
        hasError = true
    }
    else{
        setErrors((oldErrors: any) => ({...oldErrors, passwordAgain: "" }))
    }

    logger.debug("validateRegistration: ", ! hasError)
    return ! hasError;

}