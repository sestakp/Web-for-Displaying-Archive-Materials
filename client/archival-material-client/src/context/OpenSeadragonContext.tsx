import React, { Context, ReactElement, createContext, useContext } from 'react';
import useDrawingOpenSeaDragon from '../hooks/OpenSeaDragon/useDrawingOpenSeaDragon';


const OpenSeadragonContext = createContext<any>(undefined);

export const OpenSeadragonProvider = ({ children } : { children: ReactElement}) => {
  const viewerInstance = useDrawingOpenSeaDragon();

  console.log("viewer instance: ", viewerInstance)

  return (
    <OpenSeadragonContext.Provider value={viewerInstance}>
      {children}
    </OpenSeadragonContext.Provider>
  );
};

export const useOpenSeadragonContext = () : any => {
  const context = useContext(OpenSeadragonContext);

  if (!context) {
    throw new Error('useOpenSeadragon must be used within an OpenSeadragonProvider');
  }

  return context;
};
