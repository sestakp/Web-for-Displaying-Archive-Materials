import { useMemo } from "react";
import { useAppSelector } from "../../hooks";
import bookmarkSelector from "../bookmarkSelector";



const useBookmarkSelector = () => {

    const data = useAppSelector(bookmarkSelector.getData);

    const result = useMemo(() => {
        return {
            data
        };
    }, [data]);
    
      return result;
}

export default useBookmarkSelector;
