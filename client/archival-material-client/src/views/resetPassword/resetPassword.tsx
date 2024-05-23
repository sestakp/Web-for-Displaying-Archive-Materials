import React, { useState } from "react";
import { Button } from "primereact/button";
import styles from "./resetPassword.module.scss"
import Paper from "../../components/Paper/Paper";
import { Password } from "primereact/password";
import { useNavigate, useParams } from "react-router-dom";
import ChangePassword from "../../models/User/ChangePassword";
import FormErrorLabel from "../../components/formErrorLabel/FormErrorLabel";
import formHandleChange from "../../utils/formHandleChange";
import validateChangePassword from "../../validators/validateChangePassword";
import toastService from "../../utils/ToastUtil";
import RoutesEnum from "../../layout/RoutesEnum";
import UserApi from "../../api/UserApi";
import PasswordResetDto from "../../models/User/PasswordResetDto";

const ResetPassword: React.FC = () => {

    const navigate = useNavigate();

    const { resetHash } = useParams()

    const [formData, setFormData] = useState<ChangePassword>({
        password: "",
        passwordAgain: "",
    });

    const [errors, setErrors] = useState({
        password: "",
        passwordAgain: "",
    });

    

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();

        if(validateChangePassword(true, formData, setErrors)){
            
            const passwordResetDto = {
                hash: resetHash,
                password: formData.password
            } as PasswordResetDto

            await UserApi.resetPassword(passwordResetDto)

            setFormData({
                passwordAgain: "",
                password: ""
            })
            
            toastService.successToast("Heslo změněno, můžete se přihlásit.")
            navigate(RoutesEnum.LOGIN)
        }
        else{
            toastService.errorToast("Chyba validace formuláře pro reset hesla.")
        }
    }

    return(
        <div className={styles.outerContainer}> 
            <Paper>
                <div className={styles.container}>
                    <div>
                        <h2>Změna hesla</h2>
                        <span className={`p-float-label ${styles.inputWrapper}`}>
                            <Password inputId="password" value={formData.password} onChange={(e) => formHandleChange(e, setFormData)} className={styles.input}/>
                            <label htmlFor="password">Heslo</label>
                        </span>
                        <FormErrorLabel text={errors.password}/>

                        <span className={`p-float-label ${styles.inputWrapper}`}>
                            <Password inputId="passwordAgain" value={formData.passwordAgain} onChange={(e) => formHandleChange(e, setFormData)} className={styles.input}/>
                            <label htmlFor="passwordAgain" >Heslo znovu</label>
                        </span>
                        <FormErrorLabel text={errors.passwordAgain}/>
                        
                        <div className={styles.submitButton}>
                            <Button label="Změnit heslo" onClick={handleSubmit}/>
                        </div>
                    </div>
                    
                </div>
            </Paper>
        </div>
    )
}

export default ResetPassword;