import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../hooks";
import NoteAction from "../noteAction";
import AccessibilityEnum from "../../../models/AccessibilityEnum";





const useNoteActions = () => {

    const dispatch = useAppDispatch();

    const navigate = useNavigate();

    const upsertNote = (url: string, data: string, accessibility: AccessibilityEnum) => dispatch(NoteAction.upsertNote(navigate, url, data, accessibility));
    const getNotes = (archivalRecordId: number) => dispatch(NoteAction.getNotes(navigate, archivalRecordId));


    return { upsertNote, getNotes }

}


export default useNoteActions;