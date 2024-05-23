import React, { useState } from "react";
import { InputText } from 'primereact/inputtext';
import { Button } from "primereact/button";
import styles from "./forgotPassword.module.scss"
import Paper from "../../components/Paper/Paper";
import isEmailValid from "../../utils/isEmailValid";
import toastService from "../../utils/ToastUtil";
import UserApi from "../../api/UserApi";

const ForgotPassword: React.FC = () => {

    const [email, setEmail] = useState<string>("")

    async function onSubmit() {
        if (!isEmailValid(email)) {
            toastService.errorToast("Neplatný formát emailu")
            return;
        }
        try {
            await UserApi.sendPasswordResetRequest(email)            
            toastService.successToast("Email pro resetování hesla úspěšně odeslán.")
        }
        catch (error: any) {
            //TODO... when its return 404 then its not found
            console.log("error: ", error?.request.status)

            if(error?.request.status === 404){
                toastService.errorToast("Profil s tímto emailem neexistuje, prosím registrujte se.")

                return;
            }
            
            toastService.errorToast("Něco se nepovedlo.")
        }
    }

    return (
        <div className={styles.outerContainer}>
            <Paper>
                <div className={styles.container}>
                    <h2>Obnova hesla</h2>
                    <span className={`p-float-label ${styles.inputWrapper}`}>
                        <InputText id="email" value={email} onChange={(e) => setEmail(e.target.value)} className={styles.input} />
                        <label htmlFor="email">Email</label>
                    </span>

                    <div className={styles.submitButtonWrapper}>
                        <Button label="Odeslat link na reset hesla" onClick={onSubmit}/>
                    </div>
                </div>

            </Paper>
        </div>
    )
}

export default ForgotPassword;