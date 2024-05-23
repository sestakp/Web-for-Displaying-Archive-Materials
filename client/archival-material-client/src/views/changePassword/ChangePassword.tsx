import { useNavigate } from "react-router-dom"
import useUserSelector from "../../store/user/hooks/userSelectorHook"
import { useEffect, useState } from "react"
import RoutesEnum from "../../layout/RoutesEnum"
import styles from "./ChangePassword.module.scss"
import Paper from "../../components/Paper/Paper"
import UserUpdateDto from "../../models/User/UserUpdateDto"
import FormErrorLabel from "../../components/formErrorLabel/FormErrorLabel"
import toastService from "../../utils/ToastUtil"
import useUserActions from "../../store/user/hooks/userActionHook"
import { Password } from "primereact/password"
import validateChangePassword from "../../validators/validateChangePassword"
import formHandleChange from "../../utils/formHandleChange"
import { Button } from "primereact/button"


const ChangePassword: React.FC = () => {

    const userSelector = useUserSelector()
    const userActions = useUserActions()

    const navigate = useNavigate()

    const [formData, setFormData] = useState<UserUpdateDto>({
        password: "",
        passwordAgain: "",
    });

    const [errors, setErrors] = useState({
        password: "",
        passwordAgain: "",
    });

    useEffect(() => {

        if(userSelector.user === undefined){
            navigate(RoutesEnum.HOME)
        }

    },[userSelector.user, navigate])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if(validateChangePassword(true, formData, setErrors)){

            console.log("Form data submitted:", formData);

            
            userActions.updateUser(formData)

            setFormData({
                passwordAgain: "",
                password: ""
            })
            
            navigate(RoutesEnum.PROFILE)
        }
        else{
            toastService.errorToast("Chyba validace přihlašovacího formuláře")
        }
    }

    return (
        <div className={styles.outerContainer}> 
            <Paper>
                <div className={styles.container}>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <h2>Formulář pro změnu hesla</h2>
                            
                            <span className={`p-float-label ${styles.inputWrapper}`}>
                                <Password inputId="password" value={formData.password} onChange={(e) => formHandleChange(e, setFormData)} className={styles.input} toggleMask/>
                                <label htmlFor="password">Heslo</label>
                            </span>
                            <FormErrorLabel text={errors.password}/>

                            <span className={`p-float-label ${styles.inputWrapper}`}>
                                <Password inputId="passwordAgain" value={formData.passwordAgain} onChange={(e) => formHandleChange(e, setFormData)} className={styles.input} toggleMask/>
                                <label htmlFor="passwordAgain">Heslo znovu</label>
                            </span>
                            <FormErrorLabel text={errors.passwordAgain}/>

                            
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

export default ChangePassword;