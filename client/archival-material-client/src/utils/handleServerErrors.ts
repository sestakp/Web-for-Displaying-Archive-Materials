import axios, { AxiosError } from "axios";
import { NavigateFunction } from "react-router-dom";
import logger from "./loggerUtil";
import RoutesEnum from "../layout/RoutesEnum";
import toastService from "./ToastUtil";




export default function handleServerErrors(navigate: NavigateFunction, error: unknown){

    logger.debug("handle server errors")

    if(axios.isAxiosError(error)){

        if(error.code == AxiosError.ERR_NETWORK){
            toastService.errorToast("Chyba při komunikaci se serverem, server není dostupný")
            navigate(RoutesEnum.SERVER_DOWN)
            return;
        }

        if(error.request.status == 401){
            toastService.errorToast("Chyba při autentizaci uživatele")
            navigate(RoutesEnum.UNAUTHORIZED)
            return;
        }

        if(error.request.status == 404){
            toastService.errorToast("Stránka nenalezena")
            navigate(RoutesEnum.NOT_FOUND)
            return;
        }

        logger.error(error.code)
    }

    throw error;

}