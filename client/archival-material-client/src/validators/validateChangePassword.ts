import UserUpdateDto from "../models/User/UserUpdateDto";
import logger from "../utils/loggerUtil";




export default function validateChangePassword(alrSubmit: boolean, formData: UserUpdateDto, setErrors: React.Dispatch<React.SetStateAction<any>>): boolean{

    if( ! alrSubmit){
        return false;
    }

    let hasError = false

    if(formData.password == undefined){
        
        setErrors((oldErrors:any) => ({...oldErrors, password: "Heslo musí být vyplněno" }))
        hasError = true

        
    }
    else{
        if(formData.password.length < 5){
            setErrors((oldErrors:any) => ({...oldErrors, password: "Heslo musí být dlouhé minimálně 6 znaků" }))
            hasError = true
        }
        else{
            setErrors((oldErrors:any) => ({...oldErrors, password: "" }))
        }
    }

    if(formData.passwordAgain == undefined){
        
        setErrors((oldErrors:any) => ({...oldErrors, passwordAgain: "Heslo musí být vyplněno" }))
        hasError = true

        
    }
    else{
        if(formData.passwordAgain != formData.password){
            setErrors((oldErrors:any) => ({...oldErrors, passwordAgain: "Hesla se musí shodovat" }))
            hasError = true
        }
        else{
            setErrors((oldErrors:any) => ({...oldErrors, passwordAgain: "" }))
        }
    }
    

    logger.debug("validate change password: ", ! hasError)
    return ! hasError;
}