import LoadingStatusEnum from "../../../models/LoadingStatusEnum";
import LocationState from "./locationStateInterface";



const locationDefaultState: LocationState = {
    locations: [],
    regions: [],
    countries: [],
    districts: [],
    status: LoadingStatusEnum.IDLE,
};

export default locationDefaultState