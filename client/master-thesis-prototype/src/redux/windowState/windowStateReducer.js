import WindowStateTypes from './windowStateTypes';

const INITIAL_STATE = {

  isSidePanelOpen: true,
  isHelpModalOpen: false,
  isFilterPanelOpen: false,
};

const WindowStateReducer = (state = INITIAL_STATE, action, actions) => {
  switch (action.type) {
  case WindowStateTypes.TOGGLE_SIDE_PANEL_OPEN:
    return ({
      ...state,
      isSidePanelOpen: !state.isSidePanelOpen,
    });

  case WindowStateTypes.TOGGLE_HELP_MODAL_OPEN:
    return ({
      ...state,
      isHelpModalOpen: !state.isHelpModalOpen,
    });

  case WindowStateTypes.TOGGLE_FILTER_PANEL_OPEN:
    return ({
      ...state,
      isFilterPanelOpen: !state.isFilterPanelOpen,
    });

  default:
    return state;
  }
};


export default WindowStateReducer;
