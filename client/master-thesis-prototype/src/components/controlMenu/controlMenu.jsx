import React from "react";
import { connect } from "react-redux";
import ControlMenuConnectors from "./controlMenuConnectors";
import styles from "./controlMenu.module.css";
import buttonStyles from "@styles/button.module.css";
import { Grid } from "@mui/material";
import { Tooltip } from "primereact/tooltip";
import { Button } from "primereact/button";
import icons from "@utils/iconUtil";
import FullscreenUtil from "@utils/fullscreenUtil";
import downloadImageUtil from "@utils/DownloadImageUtil";
import BookmarkPanel from "../bookmarkPanel/bookmarkPanel";
import logger from "@utils/loggerUtil";
import PropTypes from 'prop-types';

/**
 * ControlMenu Component
 * @param {Object} props - Component properties.
 * @param {Function} props.rotateLeft - Callback function to rotate the image left.
 * @param {Function} props.rotateRight - Callback function to rotate the image right.
 * @param {Function} props.toggleLock - Callback function to toggle the image lock.
 * @param {boolean} props.isLocked - Indicates whether the image is locked.
 * @param {Function} props.reset - Callback function to reset the settings.
 * @param {Function} props.toggleSidebar - Callback function to toggle the sidebar.
 * @param {Function} props.toggleNoteLayerVisibility - Callback function to toggle the visibility of note layers.
 * @param {Function} props.toggleFilterPanelOpen - Callback function to toggle the filter panel.
 * @param {number} props.currentImage - The index of the current image.
 * @return {JSX.Element} The ControlMenu component.
 */
function ControlMenu(props) {
  logger.debug("styles: ", styles, buttonStyles);
  return (
    <div className={styles.wrapper}>
      <Grid container style={{ justifyContent: "flex-start" }}>

        <Tooltip content="Otočit snímek doleva" target=".rotate-left-button" position="bottom" />
        <Button onClick={props.rotateLeft} className={`${buttonStyles.ctrBtn} rotate-left-button`} size="small">
          <icons.RotateLeft />
        </Button>


        <Tooltip content="Otočit snímek doprava" target=".rotate-right-button" position="bottom" />
        <Button onClick={props.rotateRight} className={`${buttonStyles.ctrBtn} rotate-right-button`} size="small">
          <icons.RotateRight />
        </Button>


        <Tooltip content="Uzamčít pozici" target=".lock-button" position="bottom" />
        <Button onClick={props.toggleLock} className={`${buttonStyles.ctrBtn} lock-button`} size="small">

          {props.isLocked ? <icons.Lock /> : <icons.LockOpen />}

        </Button>

        <Tooltip content="Režim celé obrazovky" target=".fullscreen-button" position="bottom" />
        <Button onClick={FullscreenUtil.toggleFullscreen} className={`${buttonStyles.ctrBtn} fullscreen-button`} size="small">

          {FullscreenUtil.isFullScreen() ? <icons.FullscreenExit /> : <icons.Fullscreen />}

        </Button>

        <Tooltip content="Reset nastavení" target=".reset-button" position="bottom" />
        <Button onClick={props.reset} className={`${buttonStyles.ctrBtn} reset-button`} size="small">
          <icons.Reset />
        </Button>

        <Tooltip content="Zobrazit náhled snímků" target=".sidebar-button" position="bottom" />
        <Button onClick={props.toggleSidebar} className={`${buttonStyles.ctrBtn} sidebar-button`} size="small">
          <icons.ViewSidebar />
        </Button>

        <Tooltip content="Zobrazit přepis snímků" target=".note-button" position="bottom" />
        <Button onClick={props.toggleNoteLayerVisibility} className={`${buttonStyles.ctrBtn} note-button`} size="small">
          <icons.Note />
        </Button>


        <Tooltip content="Zobrazit nastavení barev" target=".settings-button" position="bottom" />
        <Button onClick={props.toggleFilterPanelOpen} className={`${buttonStyles.ctrBtn} settings-button`} size="small">
          <icons.Settings />
        </Button>

        <Tooltip content="Stáhnout folio" target=".download-button" position="bottom" />
        <Button onClick={() => downloadImageUtil(props.currentImage)} className={`${buttonStyles.ctrBtn} download-button`} size="small">
          <icons.Download />
        </Button>


        <Tooltip content="Nápověda" target=".help-button" position="bottom" />
        <Button onClick={props.toggleHelpModalOpen} className={`${buttonStyles.ctrBtn} help-button`} size="small">
          <icons.Help />
        </Button>

      </Grid>

      <BookmarkPanel />

    </div>
  );
}

ControlMenu.propTypes = {
  rotateLeft: PropTypes.func.isRequired,
  rotateRight: PropTypes.func.isRequired,
  isLocked: PropTypes.bool.isRequired,
  toggleLock: PropTypes.func.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  toggleHelpModalOpen: PropTypes.func.isRequired,
  toggleFilterPanelOpen: PropTypes.func.isRequired,
  toggleNoteLayerVisibility: PropTypes.func.isRequired,
  currentImage: PropTypes.string.isRequired,
};

// Connect the component using connect
export default connect(
  ControlMenuConnectors.mapStateToProps,
  ControlMenuConnectors.mapDispatchToProps,
)(ControlMenu);
