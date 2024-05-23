import React from "react";
import { connect } from "react-redux";
import NavigationNotchConnectors from "./navigationNotchConnectors";
import { Grid } from "@mui/material";
import { Tooltip } from "primereact/tooltip";
import { Button } from "primereact/button";
import icons from "@utils/iconUtil";
import styles from "./navigationNotch.module.css";
import buttonStyles from "@styles/button.module.css";
import PropTypes from 'prop-types';

/**
 * NavigationNotch component.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {function} props.moveLeft - Callback function to move to the previous page.
 * @param {function} props.moveRight - Callback function to move to the next page.
 * @param {string} props.galleryProgress - The current progress of the gallery.
 *
 * @return {JSX.Element} React JSX element representing the NavigationNotch component.
 */
function NavigationNotch(props) {
  return (
    <div className={`${styles.wrapper}`}>
      <Grid container style={{ justifyContent: "center" }} >

        <Grid item style={{ backgroundColor: "rgb(50,50,50)" }}>
          <Tooltip content="Přechod na předchozí stránku" target=".move-left-button" position="top" />
          <Button onClick={props.moveLeft} className={`${buttonStyles.ctrBtn} move-left-button`} size="small" >
            <icons.ArrowBack />
          </Button>
        </Grid>

        <Grid item style={{ backgroundColor: "rgb(50,50,50)" }}>
          <p style={{ color: "white", textAlign: "center", width: "100%" }}>{props.galleryProgress}</p>
        </Grid>

        <Grid item style={{ backgroundColor: "rgb(50,50,50)" }}>
          <Tooltip content="Přechod na další stránku" target=".move-right-button" position="top" />
          <Button onClick={props.moveRight} className={`${buttonStyles.ctrBtn} move-right-button`} size="small">
            <icons.ArrowForward />
          </Button>
        </Grid>

      </Grid>


    </div>
  );
}

NavigationNotch.propTypes = {
  moveLeft: PropTypes.func.isRequired,
  moveRight: PropTypes.func.isRequired,
  galleryProgress: PropTypes.string.isRequired,
};

// Connect the component using connect
export default connect(
  NavigationNotchConnectors.mapStateToProps,
  NavigationNotchConnectors.mapDispatchToProps,
)(NavigationNotch);
