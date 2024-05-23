import Archive from "../../../models/Archive/Archive";
import LoadingStatusEnum from "../../../models/LoadingStatusEnum";




export default interface ArchiveState {

    data: Archive[],
    status: LoadingStatusEnum,

}