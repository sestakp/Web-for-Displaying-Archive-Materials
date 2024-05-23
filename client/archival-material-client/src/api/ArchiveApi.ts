import axios from "axios";
import Archive from "../models/Archive/Archive";




const baseUrl = process.env.REACT_APP_API_URL + "/archives";

const ArchiveApi = {

    getAllArchives: async(): Promise<Archive[]> => {
        const response = await axios.get(baseUrl, {
                headers: {
                    'Content-Type': 'application/json'
                },
            })
        return response.data;     
    },
}

export default ArchiveApi;
