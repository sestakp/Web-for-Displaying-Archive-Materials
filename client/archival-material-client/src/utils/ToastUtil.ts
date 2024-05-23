import { toast } from 'react-toastify';


const toastService = {
    successToast: (message: string) => {
        
        toast.success(message)
    },

    errorToast: (message: string) => {
        toast.error(message)
    },

    
    infoToast: (message: string) => {
        toast.info(message)
    },

        
    warningToast: (message: string) => {
        toast.warn(message)
    },


    basicToast: (message: string) => {
        toast(message)
    },

    promiseToast: (promise: Promise<any>, message: string = "Požadavek se zpracovává") => {
        toast.promise(
            promise,
            {
                pending: message,
                success: 'Požadavek byl úspěšný',
                error: 'Něco se pokazilo :('
            }
        )
    }
}



export default toastService;