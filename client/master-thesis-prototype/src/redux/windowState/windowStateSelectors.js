

const WindowStateSelector = {
  isSidePanelOpen: (state) => state.windowState.isSidePanelOpen,
  isHelpModalOpen: (state) => state.windowState.isHelpModalOpen,
  isFilterPanelOpen: (state) => state.windowState.isFilterPanelOpen,
};

export default WindowStateSelector;
