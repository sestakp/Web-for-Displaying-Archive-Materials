import { useMemo } from "react";
import { useAppSelector } from "../../hooks";
import UserSelector from "../userSelector";




const useUserSelector = () => {


    const user = useAppSelector(UserSelector.getUser);

    const result = useMemo(() => {
        return {
          user
        };
      }, [user]);
    
      return result;
}

export default useUserSelector;