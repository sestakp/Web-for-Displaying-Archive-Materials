import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../hooks";
import LocationAction from "../locationAction";





const useLocationActions = () => {

    const dispatch = useAppDispatch();

    const navigate = useNavigate();

    const fetchLocations = (q: string) => dispatch(LocationAction.fetchLocations(navigate, q));
    
    const fetchCountries = () => dispatch(LocationAction.fetchCountries(navigate));
    const fetchDistricts = () => dispatch(LocationAction.fetchDistricts(navigate));
    const fetchRegions = () => dispatch(LocationAction.fetchRegions(navigate));

    return { fetchLocations, fetchCountries, fetchDistricts, fetchRegions }
}

export default useLocationActions;