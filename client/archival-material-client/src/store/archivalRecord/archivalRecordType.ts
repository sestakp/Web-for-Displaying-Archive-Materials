

enum ArchivalRecordTypes {
    SET_DATA = "@@archival_record/SET_DATA",
    APPEND_PAGE = "@@archival_record/APPEND_PAGE",
    SET_PAGE = "@@archival_record/SET_PAGE",
    SET_PAGE_SIZE = "@@archival_record/SET_PAGE_SIZE",
    SET_DETAIL = "@@archival_record/SET_DETAIL",
    SET_MAX_PAGE = "@@archival_record/SET_MAX_PAGE",
    SET_TOTAL_ELEMENTS = "@@archival_record/SET_TOTAL_ELEMENTS",
    SET_SEARCH_TEXT = "@@archival_record/SET_SEARCH_TEXT",
    SET_YEAR_FROM = "@@archival_record/SET_YEAR_FROM",
    SET_YEAR_TO = "@@archival_record/SET_YEAR_TO",
    SET_ARCHIVE = "@@archival_record/SET_ARCHIVE",
    SET_LOCATION = "@@archival_record/SET_LOCATION",
    SET_STATUS = "@@archival_record/SET_STATUS",
    SET_TYPE_OF_RECORD = "@@archival_record/SET_TYPE_OF_RECORD",
    SET_SCANS = "@@archival_record/SET_SCANS",
    SET_ONLY_FAVOURITES = "@@archival_record/SET_ONLY_FAVOURITES",
    SET_ONLY_WITH_NOTES = "@@archival_record/SET_ONLY_WITH_NOTES",
    SET_ONLY_WITH_BOOKMARKS = "@@archival_record/SET_ONLY_WITH_BOOKMARKS",
    SET_COUNTRY = "@@archival_record/SET_COUNTRY",
    SET_REGION = "@@archival_record/SET_REGION",
    SET_DISTRICT="@@archival_record/SET_DISTRICT",
    SET_ONLY_DIGITALIZED="@@archival_record/SET_ONLY_DIGITALIZED",
    TOGGLE_FILTERS_OPEN="@@archival_record/TOGGLE_FILTERS_OPEN",
    RESET_FILTERS="@@archival_record/RESET_FILTERS",
    SET_COUNTS="@@archival_record/SET_COUNTS",
    SET_ORDER="@@archival_record/SET_ORDER",
  }

export default ArchivalRecordTypes;