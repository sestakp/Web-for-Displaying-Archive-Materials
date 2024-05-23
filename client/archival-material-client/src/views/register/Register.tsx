import React, { useEffect, useState } from "react";
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from "primereact/button";
import styles from "./Register.module.scss"
import RequiredStar from "../../components/requiredStar/RequiredStar";
import Paper from "../../components/Paper/Paper";
import FormErrorLabel from "../../components/formErrorLabel/FormErrorLabel";
import toastService from "../../utils/ToastUtil";
import RegisterDto from "../../models/User/RegisterDto";
import useUserActions from "../../store/user/hooks/userActionHook";
import { useNavigate } from "react-router-dom";
import formHandleChange from "../../utils/formHandleChange";
import validateRegistration from "../../validators/validateRegistration";

const Register: React.FC = () => {

    
    const userActions = useUserActions()
    const navigate = useNavigate()


    const [formData, setFormData] = useState<RegisterDto>({
        name: "",
        email: "",
        password: "",
        passwordAgain: "",
    });

    const [errors, setErrors] = useState({
        name: "",
        email: "",
        password: "",
        passwordAgain: "",
    });

    const [alreadySubmitted, setAlreadySubmitted] = useState(false)
    

    useEffect(() => {
        validateRegistration(alreadySubmitted, formData, setErrors)
    }, [formData, alreadySubmitted])


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        setAlreadySubmitted(true);

        if(validateRegistration(true, formData, setErrors)){
            
            userActions.register(formData);

            setFormData({
                name: "",
                email: "",
                password: "",
                passwordAgain: ""
            })
            
            setAlreadySubmitted(false);

            toastService.successToast("Registrace úspěšná")
            navigate("/login")
        }
        else{
            toastService.errorToast("Chyba validace registračního formuláře")
        }

    };


    return(
        <div className={styles.outerContainer}> 
            <Paper>
                <div className={styles.container}>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <h2>Registrace</h2>
                            
                            <span className={`p-float-label ${styles.inputWrapper}`}>
                                <InputText id="name" value={formData.name} onChange={(e) => formHandleChange(e, setFormData)} className={styles.input}/>
                                <label htmlFor="name">Uživatelské jméno<RequiredStar/></label>
                            </span>
                            <FormErrorLabel text={errors.name}/>

                            <span className={`p-float-label ${styles.inputWrapper}`}>
                                <InputText id="email" value={formData.email} onChange={(e) => formHandleChange(e, setFormData)} className={styles.input}/>
                                <label htmlFor="email">Email<RequiredStar/></label>
                            </span>
                            <FormErrorLabel text={errors.email}/>
                            
                            <span className={`p-float-label ${styles.inputWrapper}`}>
                                <Password inputId="password" value={formData.password} onChange={(e) => formHandleChange(e, setFormData)} className={styles.input} toggleMask />
                                <label htmlFor="password">Heslo<RequiredStar/></label>
                            </span>
                            <FormErrorLabel text={errors.password}/>
                            
                            <span className={`p-float-label ${styles.inputWrapper}`}>
                                <Password inputId="passwordAgain" value={formData.passwordAgain} onChange={(e) => formHandleChange(e, setFormData)} className={styles.input} toggleMask />
                                <label htmlFor="passwordAgain">Heslo znovu<RequiredStar/></label>
                            </span>
                            <FormErrorLabel text={errors.passwordAgain}/>

                            <div className={styles.submitButtonWrapper}>
                                <Button label="Registrovat" type="submit" className={`${styles.submitButton}`}/>
                            </div>
                        </div>
                    </form>
                </div>
            </Paper>
        </div>
    )
}

export default Register;