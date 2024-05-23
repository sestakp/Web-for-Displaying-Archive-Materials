import axios from "axios";
import GetAllArchivalRecordsRequestDto from "../models/ArchivalRecord/GetAllArchivalRecordsRequest";
import ArchivalRecordPage from "../models/ArchivalRecord/ArchivalRecordPage";
import ArchivalRecordDetail from "../models/ArchivalRecord/ArchivalRecordDetail";
import TODO from "../models/TODO";
import GetCountsByMunicipalityRequestDto from "../models/ArchivalRecord/GetCountsByMunicipalityRequestDto";
import CountsByMunicipalityDto from "../models/ArchivalRecord/CountsByMunicipalityDto";
import logger from "../utils/loggerUtil";


const baseUrl = process.env.REACT_APP_API_URL + "/archival-records";


const ArchivalRecordApi = {

    getAllArchivalRecords: async(request: GetAllArchivalRecordsRequestDto, token: string | undefined): Promise<ArchivalRecordPage> => {

        request.page = Math.max(request.page - 1, 0);
        const response = await axios.get(baseUrl, {
                params: request,
                headers: {
                    'Content-Type': 'application/json',                    
                    'Authorization': token !== undefined ? `Bearer ${token}` : undefined
                },
            })
        return response.data;
    },

    getArchivalRecordById: async(id: number, token: string | undefined): Promise<ArchivalRecordDetail> => {
        const response = await axios.get(baseUrl + "/" + id,{
            headers: {
                'Authorization': token !== undefined ? `Bearer ${token}` : undefined
            }
        })
        return response.data;
    },

    getScans: async(id: number): Promise<ArchivalRecordDetail> => {
        const response = await axios.get(baseUrl + "/" + id + "/scans")
        return response.data;
    },

    getCountsByMunicipality: async(request: GetCountsByMunicipalityRequestDto): Promise<CountsByMunicipalityDto> => {
        logger.debug("getCountsByMunicipality calling via API")
        const response = await axios.get(baseUrl + "/getCountsByMunicipality", {
            params: request
        })

        return response.data;
    }
    
}

export default ArchivalRecordApi;