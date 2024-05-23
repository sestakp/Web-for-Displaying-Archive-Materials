import React, { useEffect, useState } from "react";
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from "primereact/button";
import styles from "./Login.module.scss"
import { Link, useNavigate } from "react-router-dom";
import RoutesEnum from "../../layout/RoutesEnum";
import Paper from "../../components/Paper/Paper";
import toastService from "../../utils/ToastUtil";
import FormErrorLabel from "../../components/formErrorLabel/FormErrorLabel";
import LoginDto from "../../models/User/LoginDto";
import useUserActions from "../../store/user/hooks/userActionHook";
import formHandleChange from "../../utils/formHandleChange";
import validateLogin from "../../validators/validateLogin";

const Login: React.FC = () => {

    const navigate = useNavigate()
    const userActions = useUserActions()

    const [formData, setFormData] = useState<LoginDto>({
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState({
        email: "",
        password: "",
    });

    
    const [alreadySubmitted, setAlreadySubmitted] = useState(false)

    useEffect(() => {
        validateLogin(alreadySubmitted, formData, setErrors)
    }, [formData, alreadySubmitted])

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();
        
        setAlreadySubmitted(true);

        if(validateLogin(true, formData, setErrors)){

            await userActions.login(formData)

            setFormData({
                email: "",
                password: ""
            })
            
            navigate(RoutesEnum.PROFILE)
        }
        else{
            toastService.errorToast("Chyba validace přihlašovacího formuláře")
        }
    }

    return(
        <div className={styles.outerContainer}> 
            <Paper>
                <div className={styles.container}>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <h2>Přihlašovací formulář</h2>
                            <span className={`p-float-label ${styles.inputWrapper}`}>
                                <InputText id="email" value={formData.email} onChange={(e) => formHandleChange(e, setFormData)} className={styles.input}/>
                                <label htmlFor="email">Email</label>
                            </span>
                            <FormErrorLabel text={errors.email}/>
                            
                            <span className={`p-float-label ${styles.inputWrapper}`}>
                                <Password feedback={false} inputId="password" value={formData.password} onChange={(e) => formHandleChange(e, setFormData)} className={styles.input} toggleMask/>
                                <label htmlFor="password">Password</label>
                            </span>
                            <FormErrorLabel text={errors.password}/>

                            <Link to={RoutesEnum.FORGOT_PASSWORD}><p className={styles.forgotPassword}><small>zapomněl jsem heslo</small></p></Link>
                            <div className={styles.submitButtonWrapper}>
                                <Button label="Přihlásit" type="submit" />
                            </div>
                        </div>
                    </form>
                </div>
            </Paper>
        </div>
    )
}

export default Login;