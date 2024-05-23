import ArchivalRecordDetail from "../../../models/ArchivalRecord/ArchivalRecordDetail";
import ArchivalRecordList from "../../../models/ArchivalRecord/ArchivalRecordList";
import CountsByMunicipalityDto from "../../../models/ArchivalRecord/CountsByMunicipalityDto";
import LoadingStatusEnum from "../../../models/LoadingStatusEnum";
import SearchOptions from "../../../models/SearchOptions";



export default interface ArchivalRecordState {

    data: ArchivalRecordList[],
    detail: ArchivalRecordDetail | undefined,
    status: LoadingStatusEnum,
    searchOptions: SearchOptions,
    filtersOpen: boolean,
    counts: CountsByMunicipalityDto

}