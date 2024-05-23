import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../hooks";
import ArchiveAction from "../archiveAction";







const useArchiveActions = () => {
    const dispatch = useAppDispatch();
  
    const navigate = useNavigate();
  
  
    const fetchArchives = () => dispatch(ArchiveAction.fetchArchives(navigate));
  
    return { fetchArchives }
  };
  
  export default useArchiveActions;