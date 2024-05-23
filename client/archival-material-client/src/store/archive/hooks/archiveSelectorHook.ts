import { useMemo } from "react";
import { useAppSelector } from "../../hooks";
import archiveSelector from "../archiveSelector";





const useArchiveSelector = () => {
    
    const data = useAppSelector(archiveSelector.getData);
    const status = useAppSelector(archiveSelector.getStatus);
  
    const result = useMemo(() => {
      return {
        data,
        status,
      };
    }, [data, status]);
  
    return result;
  };
  
  export default useArchiveSelector;