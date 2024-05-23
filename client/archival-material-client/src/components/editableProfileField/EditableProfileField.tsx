import { useState } from "react";
import styles from "./EditableProfileField.module.scss"
import { InputText } from "primereact/inputtext";
import useUserSelector from "../../store/user/hooks/userSelectorHook";
import logger from "../../utils/loggerUtil";
import UserUpdateDto from "../../models/User/UserUpdateDto";
import useUserActions from "../../store/user/hooks/userActionHook";


interface EditableProfileFieldProps {
    label: string;
    value: string;
    id: keyof UserUpdateDto;
}

enum EditState {
    DEFAULT = "DEFAULT",
    EDIT = "EDIT"
}

const EditableProfileField: React.FC<EditableProfileFieldProps> = ({ label, value, id }) => {

    const userActions = useUserActions()

    const [state, setState] = useState<EditState>(EditState.DEFAULT)

    const [editValue, setEditValue] = useState<string>(value)

    const currentUser = useUserSelector().user

    function onSubmit(){
        logger.debug("currentUser: ", currentUser)
        
        const userUpdateDto = {
            id: currentUser?.id,
            [id]: editValue
        } as UserUpdateDto

        
        logger.debug("userUpdateDto: ", userUpdateDto)
        userActions.updateUser(userUpdateDto);
        setState(EditState.DEFAULT)
    }

    return (
        <div className={`${styles.wrapper}`}>
            <h2 className={`${styles.label}`}>{label}</h2>
            <div className={`${styles.valueWrapper}`}>
                { state == EditState.DEFAULT &&
                    <>
                        <p className={`${styles.value}`}>{value}</p>
                        <i className="pi pi-pencil" style={{ cursor: "pointer" }} onClick={() => setState(EditState.EDIT)}/>
                    </>
                }
                { state == EditState.EDIT &&
                    <>
                        <InputText className="p-inputtext-sm" value={editValue} onChange={(e) => setEditValue(e.target.value)}/>
                        <i className="pi pi-save" style={{ cursor: "pointer" }} onClick={() => onSubmit()}/>
                        <i className="pi pi-times" style={{ cursor: "pointer" }} onClick={() => setState(EditState.DEFAULT)}/>
                    </>
                }

            </div>
        </div>
    )
}

export default EditableProfileField;