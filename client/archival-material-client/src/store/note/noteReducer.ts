import { AnyAction } from "@reduxjs/toolkit";
import NoteState from "./noteState/noteStateInterface";
import noteDefaultState from "./noteState/noteDefaultState";
import NoteType from "./noteType";


const noteReducer = (state: NoteState = noteDefaultState, action: AnyAction): NoteState => {
    switch (action.type) {

        case NoteType.SET_NOTES:
            return { ...state, data: action.payload }
        case NoteType.UPSERT_NOTE:
            
            // Check if a note with the same scanUrl and userId already exists
            const existingNoteIndex = state.data.findIndex(
                note => note.scanUrl === action.payload.scanUrl && note.accessibility == action.payload.accessibility
            );

            if (existingNoteIndex !== -1) {
                // Note already exists, update the existing note
                const updatedData = [...state.data];
                updatedData[existingNoteIndex] = action.payload;

                return { ...state, data: updatedData };
            } else {
                // Note doesn't exist, add the new note
                return { ...state, data: [...state.data, action.payload] };
            }


        default:
            return state;
    }
}

export default noteReducer;