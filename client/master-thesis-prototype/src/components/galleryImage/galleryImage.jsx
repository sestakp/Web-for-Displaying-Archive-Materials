import React from "react";
import { connect } from "react-redux";
import styles from "./galleryImage.module.css";
import GalleryImageConnectors from "./galleryImageConnectors";
import PropTypes from 'prop-types';

/**
 * GalleryImage component displays an image with various styling properties.
 *
 * @param {object} props - The props object containing image and styling properties.
 * @param {string} props.currentImage - The source URL of the image.
 * @param {number} props.rotation - The rotation angle of the image in degrees.
 * @param {number} props.brightness - The brightness adjustment value (0-100).
 * @param {number} props.contrast - The contrast adjustment value (0-100).
 * @param {number} props.saturation - The saturation adjustment value (0-100).
 * @param {number} props.hueRotation - The hue rotation angle in degrees.
 * @param {number} props.grayScale - The grayscale effect intensity (0-100).
 * @param {number} props.invert - The invert effect intensity (0-100).
 * @param {number} props.sepia - The sepia effect intensity (0-100).
 *
 * @return {JSX.Element} React JSX element representing the GalleryImage.
 */
function GalleryImage(props) {

  return (
    <img
      className={styles.PanAndZoomImageImage}
      alt="current selected scan"
      src={props.currentImage}
      // onLoad={onLoad}
      // onDoubleClick={addTextBox}
      // ref={containerRef}
      style={{
        transform: `rotate(${props.rotation}deg)`,
        filter: `brightness(${props.brightness / 100}) contrast(${props.contrast / 100}) saturate(${props.saturation / 100}) hue-rotate(${props.hueRotation}deg) grayscale(${props.grayScale / 100}) invert(${props.invert / 100}) sepia(${props.sepia / 100})`,
      }}
    />
  );
}

GalleryImage.propTypes = {
  currentImage: PropTypes.string.isRequired,
  rotation: PropTypes.number.isRequired,
  brightness: PropTypes.number.isRequired,
  contrast: PropTypes.number.isRequired,
  hueRotation: PropTypes.number.isRequired,
  invert: PropTypes.number.isRequired,
  saturation: PropTypes.number.isRequired,
  sepia: PropTypes.number.isRequired,
  grayScale: PropTypes.number.isRequired,
};

// Connect the component using connect
export default connect(
  GalleryImageConnectors.mapStateToProps,
  GalleryImageConnectors.mapDispatchToProps,
)(GalleryImage);
