


import React, { useState } from 'react';
import Draggable from 'react-draggable';
/*https://prc5.github.io/react-zoom-pan-pinch */
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import './LightboxImageViewer.css';

const LightboxImageViewer = ({ images }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });

  const handleImageLoad = (event) => {
    const { naturalWidth, naturalHeight } = event.target;
    console.log("natural width: ", naturalWidth)
    console.log("naturalHeight: ", naturalHeight)
    setImageDimensions({ width: naturalWidth, height: naturalHeight });
  };

  const openLightbox = (index) => {
    setCurrentImageIndex(index);
    setIsOpen(true);
  };

  const closeLightbox = () => {
    setIsOpen(false);
  };

  const goToPrevious = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const goToNext = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  const currentImage = images[currentImageIndex];

  return (
    <div className="lightbox-image-viewer">
      <div className="image-grid">
        {images.map((image, index) => (
          <div key={index} className="image-container" onClick={() => openLightbox(index)}>
            <img className="thumbnail" src={image.thumbnail ?? image.url} alt={`Archival Image ${index}`} />
          </div>
        ))}
      </div>
      {isOpen && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={closeLightbox}>
              &times;
            </button>
            <TransformWrapper
              defaultScale={10000}
              defaultPositionX={0}
              defaultPositionY={0}
              wheel={{ step: 1 }}
              doubleClick={{ mode: 'reset' }}
              maxScale={90}
            >
              {({ zoomIn, zoomOut, resetTransform }) => (
                <>
                  <div className="zoom-controls">
                    <button className="zoom-button" onClick={() => zoomIn()}>
                      +
                    </button>
                    <button className="zoom-button" onClick={() => zoomOut()}>
                      -
                    </button>
                    <button className="zoom-button" onClick={() => resetTransform()}>
                      Reset Zoom
                    </button>
                  </div>
                  <TransformComponent>
                    <div style={{backgroundColor: "black", width: imageDimensions.width*2, height: "100vh", position: "relative"}}>
                        <img className="lightbox-image" src={currentImage.url} alt="Archival Image" onLoad={handleImageLoad} />
                    </div>
                   </TransformComponent>
                </>
              )}
            </TransformWrapper>
            {images.length > 1 && (
              <div>
                <button className="nav-button prev-button" onClick={goToPrevious}>
                  &lt;
                </button>
                <button className="nav-button next-button" onClick={goToNext}>
                  &gt;
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LightboxImageViewer;
