import axios from "axios";
import logger from "../utils/loggerUtil";
import Note from "../models/Note/Note";

const baseUrl = process.env.REACT_APP_API_URL + "/notes";


const NoteApi = {

    getNotesForArchivalRecord: async(archivalRecordId: number, token: string | undefined): Promise<Note[]> => {
        
        const response = await axios.get(baseUrl + "/" + archivalRecordId, {
            headers: {
                'Authorization': token !== undefined ? `Bearer ${token}` : undefined
            }
        })
        return response.data;
    },

    upsert: async(noteDto: Note, token: string): Promise<Note> => {
        const response = await axios.put(baseUrl, noteDto, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        })
        return response.data;
    }

    
}


export default NoteApi
