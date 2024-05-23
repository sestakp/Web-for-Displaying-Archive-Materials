import LoadingStatusEnum from "../../../models/LoadingStatusEnum";
import ArchiveState from "./archiveStateInterface";






const archiveDefaultState: ArchiveState = {
    data: [],
    status: LoadingStatusEnum.IDLE,
};

export default archiveDefaultState