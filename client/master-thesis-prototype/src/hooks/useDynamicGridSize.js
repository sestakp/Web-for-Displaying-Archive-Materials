import { useState, useEffect } from 'react';

/**
 * Custom hook to calculate the dynamic grid size based on default size, visibility of settings, and visibility of the sidebar.
 *
 * @param {number} defaultSize - The default grid size.
 * @param {boolean} viewSettings - Indicates whether the settings panel is visible.
 * @param {boolean} viewSidebar - Indicates whether the sidebar is visible.
 * @return {number} The calculated grid size.
 */
function useDynamicGridSize(defaultSize = 8, viewSettings = true, viewSidebar = true) {
  const [mdSize, setMdSize] = useState(defaultSize);

  useEffect(() => {
    let size = defaultSize;

    if (!viewSettings) {
      size += 2;
    }

    if (!viewSidebar) {
      size += 2;
    }

    // Update the mdSize state with the calculated value
    setMdSize(size);
  }, [defaultSize, viewSettings, viewSidebar]);

  return mdSize;
}

export default useDynamicGridSize;
