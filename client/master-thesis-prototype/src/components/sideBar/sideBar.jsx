import React from "react";
import { connect } from "react-redux";
import SideBarConnectors from "./sideBarConnectors";
import { Grid } from "@mui/material";
import PropTypes from 'prop-types';

/**
 * SideBar component for displaying image thumbnails.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {boolean} props.isSidePanelOpen - Indicates whether the side panel is open.
 * @param {Array<string>} props.images - An array of image source URLs.
 * @param {number} props.currentImageIndex - The index of the currently selected image.
 * @param {function} props.setCurrentImageIndex - Callback function to set the current image index.
 *
 * @return {JSX.Element} React JSX element representing the SideBar component.
 */
function SideBar(props) {
  return (
    <Grid item md={props.isSidePanelOpen ? 2 : 0} >
      <div
        onWheel={(e) => e.stopPropagation()} // to avoid zooming image
        style={{
          backgroundColor: "rgb(50,50,50)",
          zIndex: "998",
          position: "relative",
          overflowY: "scroll",
          display: props.isSidePanelOpen ? "inherit" : "none",
          height: "82vh",
        }}
      >
        <div>

          {props.images.map((src, index) =>
            <div style={{ position: "relative" }} key={"image_" + src}>
              <img
                src={src}
                alt="sidebar preview"
                style={{
                  width: "100%",
                  cursor: "pointer",
                  border: index === props.currentImageIndex ? " 4px solid #6366F1" : "none",
                }}
                onClick={() => props.setCurrentImageIndex(index)}
              />
              <span style={{ backgroundColor: "white", position: "absolute", left: "10px", bottom: "10px", width: "22px", height: "22px", textAlign: "center", borderRadius: "50%" }}>{index + 1}</span>
            </div>)
          }
        </div>
      </div>
    </Grid>
  );
}

SideBar.propTypes = {
  isSidePanelOpen: PropTypes.bool.isRequired,
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
  currentImageIndex: PropTypes.number.isRequired,
  setCurrentImageIndex: PropTypes.func.isRequired,
};

// Connect the component using connect
export default connect(
  SideBarConnectors.mapStateToProps,
  SideBarConnectors.mapDispatchToProps,
)(SideBar);
