import archivalRecordSelector from '../archivalRecordSelector';
import { useAppSelector } from '../../../store/hooks';
import { useMemo } from 'react';

const useArchivalRecordSelector = () => {
  const data = useAppSelector(archivalRecordSelector.getData);
  const status = useAppSelector(archivalRecordSelector.getStatus);
  const detail = useAppSelector(archivalRecordSelector.getDetail);
  const searchOptions = useAppSelector(archivalRecordSelector.getSearchOptions);
  const filtersOpen = useAppSelector(archivalRecordSelector.isFiltersOpen);
  const counts = useAppSelector(archivalRecordSelector.getCounts);
  

  const result = useMemo(() => {
    return {
      data,
      status,
      searchOptions,
      detail,
      filtersOpen,
      page: searchOptions.page,
      pageSize: searchOptions.pageSize,
      textSearch: searchOptions.textSearch,
      minPage: searchOptions.minPage,
      maxPage: searchOptions.maxPage,
      typeOfRecord: searchOptions.typeOfRecord,
      yearFrom: searchOptions.yearFrom,
      yearTo: searchOptions.yearTo,
      archive: searchOptions.archive,
      location: searchOptions.location,
      onlyFavourites: searchOptions.onlyFavourites,
      onlyWithBookmarks: searchOptions.onlyWithBookmarks,
      nextLoaded: searchOptions.nextLoaded,
      onlyWithNotes: searchOptions.onlyWithNotes,
      totalElements: searchOptions.totalElements,
      country: searchOptions.country,
      region: searchOptions.region,
      district: searchOptions.district,
      onlyDigitalized: searchOptions.onlyDigitalized,
      sortField: searchOptions.sortField,
      sortOrder: searchOptions.sortOrder,
      counts,
      isMinPage: searchOptions.page <= searchOptions.minPage,
      isMaxPage: searchOptions.page >= searchOptions.maxPage,
      canLoadNext:  searchOptions.maxPage > (searchOptions.page + searchOptions.nextLoaded)
    };
  }, [data, searchOptions, status, detail, filtersOpen, counts]);

  return result;
};

export default useArchivalRecordSelector;