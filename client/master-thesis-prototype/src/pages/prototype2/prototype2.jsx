import React, { useState } from 'react';
import debounce from 'lodash.debounce';

const Prototype2 = ({ imageUrl }) => {
  //const [zoomLevel, setZoomLevel] = useState(1);
  //const [position, setPosition] = useState({ x: 0, y: 0 });
  const [imageState, setImageState] = useState({
    zoomLevel: 1,
    position: { x: 0, y: 0 },
  });
  
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleZoomIn = () => {
    //setZoomLevel(zoomLevel + 0.1);

    setImageState({...imageState, zoomLevel: imageState.zoomLevel + 0.1})
  };

  const handleZoomOut = () => {
    setImageState({...imageState, zoomLevel: imageState.zoomLevel - 0.1})
    //setZoomLevel(zoomLevel - 0.1);
  };



  const handleZoom = (event) => {
    const zoomFactor = 0.1; // Adjust this value to control zoom sensitivity
    const zoomIn = event.deltaY < 0;
  
    // Calculate the new zoom level based on cursor position
    const newZoomLevel = zoomIn ? imageState.zoomLevel + zoomFactor : imageState.zoomLevel - zoomFactor;
  
    // Calculate the cursor position relative to the image
    const rect = event.currentTarget.getBoundingClientRect();
    const cursorX = event.clientX - rect.left;
    const cursorY = event.clientY - rect.top;
  
    // Calculate the offset ratios for X and Y axes
    const offsetX = (cursorX - imageState.position.x) / (rect.width * imageState.zoomLevel);
    const offsetY = (cursorY - imageState.position.y) / (rect.height * imageState.zoomLevel);
  
    // Calculate the new image position based on cursor position and zoom level
    const newPosition = {
      x: cursorX - offsetX * rect.width * newZoomLevel,
      y: cursorY - offsetY * rect.height * newZoomLevel,
    };
    
    
    setImageState({...imageState, zoomLevel: newZoomLevel, position: newPosition})
    //setPosition(newPosition);
    //setZoomLevel(newZoomLevel);
  };
  
  


  const handleMouseDown = (event) => {
    setIsDragging(true);
    setDragStart({ x: event.clientX, y: event.clientY });
  };

  const handleWheel = (event) => {
    // Check if the wheel event is rolling up or down
    if (event.deltaY < 0) {
      // Call your custom function for rolling up
      handleZoomIn();
    } else {
      // Call your custom function for rolling down
      handleZoomOut();
    }
  };

  const handleMouseMove = (event) => {
    if (!isDragging) return;

    const deltaX = event.clientX - dragStart.x;
    const deltaY = event.clientY - dragStart.y;


    
    setImageState({...imageState, position: {
      x: imageState.position.x + deltaX,
      y: imageState.position.y + deltaY,
    }})
    /*
    setPosition({
      x: imageState.position.x + deltaX,
      y: imageState.position.y + deltaY,
    });
    */


    setDragStart({ x: event.clientX, y: event.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      className="image-viewer"
      style={{
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        position: 'relative',
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleZoom}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          transform: `translate(${imageState.position.x}px, ${imageState.position.y}px)`,
          transition: 'transform 0.1s ease',
        }}
      >
        <img
          src={imageUrl}
          alt="High-resolution image"
          style={{
            width: `${imageState.zoomLevel * 100}%`,
            height: `${imageState.zoomLevel * 100}%`,
            userDrag: 'none',
          }}
          draggable="false"
        />
      </div>
      <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
        {/*<button onClick={handleZoomIn}>Zoom In</button>
        <button onClick={handleZoomOut}>Zoom Out</button>*/}
      </div>
    </div>
  );
};

export default Prototype2;
