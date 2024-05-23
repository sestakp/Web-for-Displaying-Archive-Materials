import { useNavigate } from 'react-router-dom';
import TypeOfRecordEnum from '../../../models/TypeOfRecordEnum';
import { useAppDispatch } from '../../hooks';
import ArchivalRecordAction from '../archivalRecordAction';
import Archive from '../../../models/Archive/Archive';
import LocationDto from '../../../models/Location/LocationDto';

const useArchivalRecordActions = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();



  const setPage = (pageNumber: number| null) => dispatch(ArchivalRecordAction.setPage(pageNumber));
  const incrementPage = () => dispatch(ArchivalRecordAction.incrementPage());
  const decrementPage = () => dispatch(ArchivalRecordAction.decrementPage());
  const loadNext = () => dispatch(ArchivalRecordAction.loadNext(navigate));
  const setPageSize = (pageSize: number) => dispatch(ArchivalRecordAction.setPageSize(pageSize));
  const setSearchText = (text: string) => dispatch(ArchivalRecordAction.setSearchText(text));
  const setYearFrom = (year: number | undefined) => dispatch(ArchivalRecordAction.setYearFrom(year));
  const setYearTo = (year: number | undefined) => dispatch(ArchivalRecordAction.setYearTo(year));
  const setArchive = (archive: Archive | undefined) => dispatch(ArchivalRecordAction.setArchive(archive));
  const setOnlyDigitalized = (digitalized: boolean) => dispatch(ArchivalRecordAction.setOnlyDigitalized(digitalized));
  const setCountry = (country: string | undefined) => dispatch(ArchivalRecordAction.setCountry(country));
  const setRegion = (region: string | undefined) => dispatch(ArchivalRecordAction.setRegion(region));
  const setDistrict = (district: string | undefined) => dispatch(ArchivalRecordAction.setDistrict(district));
  const setLocation = (location: LocationDto | undefined) => dispatch(ArchivalRecordAction.setLocation(location));
  const fetchArchivalRecords = (typeOfRecord : TypeOfRecordEnum | undefined) => dispatch(ArchivalRecordAction.fetchArchivalRecords(navigate, typeOfRecord));
  const setTypeOfRecord = (typeOfRecord: TypeOfRecordEnum | undefined) => dispatch(ArchivalRecordAction.setTypeOfRecord(typeOfRecord));
  const getArchivalRecordById = (id: number) => dispatch(ArchivalRecordAction.getArchivalRecordById(navigate, id));
  const getScans = (id: number) => dispatch(ArchivalRecordAction.getScans(navigate, id));
  const addToFavourites = (id: number | undefined) => dispatch(ArchivalRecordAction.addToFavourites(navigate, id));
  const removeFromFavourites = (id: number | undefined) => dispatch(ArchivalRecordAction.removeFromFavourites(navigate, id));
  const setOnlyFavourites = (onlyFavourites: boolean) => dispatch(ArchivalRecordAction.setOnlyFavourites(onlyFavourites));
  const setOnlyWithBookmarks = (onlyWithBookmarks: boolean) => dispatch(ArchivalRecordAction.setOnlyWithBookmarks(onlyWithBookmarks));
  const setOnlyWithNotes = (onlyWithNotes: boolean) => dispatch(ArchivalRecordAction.setOnlyWithNotes(onlyWithNotes));
  const toggleFiltersOpen = () => dispatch(ArchivalRecordAction.toggleFilterPage());
  const resetFilters = () => dispatch(ArchivalRecordAction.resetFilters());
  const getCountsByMunicipality = () => dispatch(ArchivalRecordAction.getCountsByMunicipality(navigate));
  const setOrder = (sortField: string | undefined, sortOrder: 0 | 1 | -1 | null | undefined) => dispatch(ArchivalRecordAction.setOrder(sortField, sortOrder))

  return { setPage, setPageSize, setSearchText, incrementPage, decrementPage, setArchive, setLocation, addToFavourites, setOnlyFavourites, setOnlyWithBookmarks, loadNext, toggleFiltersOpen, getCountsByMunicipality,
    setCountry, setOrder, resetFilters, setOnlyDigitalized, setRegion, setDistrict, setOnlyWithNotes, removeFromFavourites, fetchArchivalRecords, setTypeOfRecord, getArchivalRecordById, getScans, setYearFrom, setYearTo }
};

export default useArchivalRecordActions;