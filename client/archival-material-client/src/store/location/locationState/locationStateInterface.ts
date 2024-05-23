import LoadingStatusEnum from "../../../models/LoadingStatusEnum";
import CountryDto from "../../../models/Location/CountryDto";
import LocationListDto from "../../../models/Location/LocationListDto";
import RegionDto from "../../../models/Location/RegionDto";





export default interface LocationState {

    locations: LocationListDto[],
    countries: string[],
    regions: CountryDto[],
    districts: RegionDto[],
    status: LoadingStatusEnum,
}