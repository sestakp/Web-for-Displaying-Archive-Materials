import WindowStateTypes from './windowStateTypes';


const WindowStateActions = {


  toggleSidePanelOpen: () => {
    return {
      type: WindowStateTypes.TOGGLE_SIDE_PANEL_OPEN,
      // payload: undefined
    };
  },

  toggleHelpModalOpen: () => {
    return {
      type: WindowStateTypes.TOGGLE_HELP_MODAL_OPEN,
    };
  },

  toggleFilterPanelOpen: () => {
    return {
      type: WindowStateTypes.TOGGLE_FILTER_PANEL_OPEN,
      // payload: undefined
    };
  },


};

export default WindowStateActions;
