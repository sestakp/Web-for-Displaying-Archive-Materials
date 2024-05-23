import axios from "axios";
import Bookmark from "../models/Bookmark/Bookmark";







const baseUrl = process.env.REACT_APP_API_URL + "/bookmarks";


const BookmarkApi = {
    getBookmarksForArchivalRecord: async(archivalRecordId: number, token: string): Promise<Bookmark[]> => {
        const response = await axios.get(baseUrl + "/" + archivalRecordId, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        return response.data;
    },

    upsert: async(bookmark: Bookmark, token: string): Promise<Bookmark> => {
        const response = await axios.put(baseUrl, bookmark, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        })
        return response.data;
    },

    delete: async(id: number, token: string): Promise<void> => {
        await axios.delete(baseUrl + "/" + id, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        })
    }

}

export default BookmarkApi;