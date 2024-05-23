import { useMemo } from "react";
import noteSelector from "../noteSelector";
import { useAppSelector } from "../../hooks";
import AccessibilityEnum from "../../../models/AccessibilityEnum";






const useNoteSelector = () => {


    const getNote = (url: string, userId: number, accessibility: AccessibilityEnum) => noteSelector.getNote(url, userId, accessibility);
    
    const notes = useAppSelector(noteSelector.getNotes);

    const result = useMemo(() => {
        return {
            notes,
            getNote
        };
    }, [getNote, notes]);
    
      return result;
}



export default useNoteSelector;