/*
Based on: https://github.com/strateos/react-map-interaction/blob/master/src/MapInteractionCSS.jsx
Licence: MIT
*/


import React from 'react';
import PinZoomCore from './components/PinZoomCore/PinZoomCore';

/*
  This component provides a map like interaction to any content that you place in it. It will let
  the user zoom and pan the children by scaling and translating props.children using css.
*/
const PinZoomWrapper = (props) => {
  return (
    <PinZoomCore {...props}>
      {
        ({ x,y,z }) => {

          // Translate first and then scale.  Otherwise, the scale would affect the translation.
          const transform = `translate(${x}px, ${y}px) scale(${z})`;
          return (
            <div
              style={{
                height: '100%',
                width: '100%',
                position: 'relative', // for absolutely positioned children
                overflow: 'hidden',
                touchAction: 'none', // Not supported in Safari :(
                msTouchAction: 'none',
                cursor: 'all-scroll',
                WebkitUserSelect: 'none',
                MozUserSelect: 'none',
                msUserSelect: 'none'
              }}
            >
              <div
                style={{
                  display: 'inline-block', // size to content
                  transform: transform,
                  transformOrigin: '0 0 '
                }}
              >
                {props.children}
              </div>
            </div>
          );
        }
      }
    </PinZoomCore>
  );
};

export default PinZoomWrapper;