import AccessibilityEnum from "../../models/AccessibilityEnum";
import RootState from "../types/rootState";



const noteSelector = {

    getNote: (url: string, userId: number, accessibility: AccessibilityEnum) => (state: RootState) => {
        const notes = state.note.data.filter(n => n.scanUrl == url && n.accessibility == accessibility);
        if(notes.length == 1){
            return notes[0];
        }
    },

    getNotes: (state:RootState) => state.note.data
}

export default noteSelector;