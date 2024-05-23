import React from "react";
import { connect } from "react-redux";
import { Slider } from "primereact/slider";
import FiltersMenuConnectors from "./filtersMenuConnectors";
import styles from "./filtersMenu.module.css";
import icons from "@utils/iconUtil";
import { Tooltip } from "primereact/tooltip";
import { Button } from "primereact/button";
import PropTypes from 'prop-types';


/**
 * FiltersMenu component for adjusting image filters.
 *
 * @component
 * @param {Object} props - The component's props.
 * @param {number} props.brightness - The current brightness level.
 * @param {number} props.contrast - The current contrast level.
 * @param {number} props.saturation - The current saturation level.
 * @param {number} props.grayScale - The current grayscale level.
 * @param {number} props.invert - The current invert level.
 * @param {number} props.sepia - The current sepia level.
 * @param {boolean} props.isFilterPanelOpen - Whether the filter panel is open.
 * @param {function} props.setBrightness - Function to set brightness level.
 * @param {function} props.setContrast - Function to set contrast level.
 * @param {function} props.setSaturation - Function to set saturation level.
 * @param {function} props.sethueRotation - Function to set hue rotation value.
 * @param {function} props.setGrayScale - Function to set grayscale level.
 * @param {function} props.setInvert - Function to set invert level.
 * @param {function} props.setSepia - Function to set sepia level.
 * @param {function} props.resetFilters - Function to reset all filters.
 * @return {JSX.Element} JSX representation of the FiltersMenu component.
 */
function FiltersMenu(props) {
  return (
    <div
      onWheel={(e) => e.stopPropagation()} // to avoid zooming image
      style={{
        backgroundColor: "rgb(50,50,50)",
        zIndex: "998",
        position: "relative",
        // top: "0",
        // right: "0",
        width: "100%",
        height: "100vh",
        // paddingTop: "120px",
        // paddingBottom: "60px",
        overflowY: "scroll",
        display: props.isFilterPanelOpen ? "inherit" : "none",
        color: "white",
        textAlign: "center",
        overflow: "hidden",
        paddingLeft: "15px",
        paddingRight: "15px",
      }}
    >
      <div>
        <p>Jas {props.brightness}%</p>
        <Slider value={props.brightness} onChange={props.setBrightness} min={0} max={400} />
      </div>


      <div>
        <p>Kontrast {props.contrast}%</p>
        <Slider value={props.contrast} onChange={props.setContrast} min={0} max={400} />
      </div>


      <div>
        <p>Saturace {props.saturation}%</p>
        <Slider value={props.saturation} onChange={props.setSaturation} min={0} max={400} />
      </div>


      <div>
        <p>Otočení odstínu {props.hueRotation}°</p>
        <Slider value={props.hueRotation} onChange={props.sethueRotation} min={0} max={360} />
      </div>


      <div>
        <p>Odstíny šedi {props.grayScale}%</p>
        <Slider value={props.grayScale} onChange={props.setGrayScale} min={0} max={100} />
      </div>


      <div>
        <p>Převrácení barev {props.invert}%</p>
        <Slider value={props.invert} onChange={props.setInvert} min={0} max={100} />
      </div>


      <div>
        <p>Sepia {props.sepia}%</p>
        <Slider value={props.sepia} onChange={props.setSepia} min={0} max={100} />
      </div>

      <Tooltip content="Reset filrů" target=".reset-filters-button" position="bottom" />
      <Button onClick={props.resetFilters} className={`${styles.ctrBtn} reset-filters-button`} size="small">
        <icons.Reset />
        <span>&nbsp;Reset filtrů</span>
      </Button>
    </div>
  );
}

FiltersMenu.propTypes = {
  isFilterPanelOpen: PropTypes.bool.isRequired,
  setBrightness: PropTypes.func.isRequired,
  brightness: PropTypes.number.isRequired,
  setContrast: PropTypes.func.isRequired,
  contrast: PropTypes.number.isRequired,
  setSaturation: PropTypes.func.isRequired,
  saturation: PropTypes.number.isRequired,
  sethueRotation: PropTypes.func.isRequired,
  hueRotation: PropTypes.number.isRequired,
  setGrayScale: PropTypes.func.isRequired,
  grayScale: PropTypes.number.isRequired,
  setInvert: PropTypes.func.isRequired,
  invert: PropTypes.number.isRequired,
  setSepia: PropTypes.func.isRequired,
  sepia: PropTypes.number.isRequired,
  resetFilters: PropTypes.func.isRequired,
};


// Connect the component using connect
export default connect(
  FiltersMenuConnectors.mapStateToProps,
  FiltersMenuConnectors.mapDispatchToProps,
)(FiltersMenu);
