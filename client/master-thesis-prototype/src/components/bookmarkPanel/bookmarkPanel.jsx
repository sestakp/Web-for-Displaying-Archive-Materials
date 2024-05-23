import React from "react";
import { connect } from "react-redux";
import BookmarkPanelConnectors from "./bookmarkPanelConnectors";
import { Grid } from "@mui/material";
import { Tooltip } from "primereact/tooltip";
import { Button } from "primereact/button";
import buttonStyles from "@styles/button.module.css";
import icons from "@utils/iconUtil";
import PropTypes from 'prop-types';

/**
 * BookmarkPanel component for managing bookmarks.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {function} props.setCurrentImageIndex - Function to set the current image index.
 * @param {function} props.addBookmark - Function to add a bookmark.
 * @return {JSX.Element} The rendered BookmarkPanel component.
 */
function BookmarkPanel(props) {
  return (
    <Grid container>
      <Grid container item md={10}>
        <Tooltip content={"Vesnice A od 1950"} target=".bookmark-1" position="right" />
        <Button onClick={() => props.setCurrentImageIndex(1)} className={`${buttonStyles.ctrBtn} bookmark-1`} size="small">
          <icons.Bookmark />
        </Button>


        <Tooltip content="Vesnice B od 1950" target=".bookmark-2" position="bottom" />
        <Button onClick={() => props.setCurrentImageIndex(5)} className={`${buttonStyles.ctrBtn} bookmark-2`} size="small">
          <icons.Bookmark />
        </Button>


        <Tooltip content="Vesnice C od 1950" target=".bookmark-3" position="bottom" />
        <Button onClick={() => props.setCurrentImageIndex(10)} className={`${buttonStyles.ctrBtn} bookmark-3`} size="small">
          <icons.Bookmark />
        </Button>

      </Grid>


      <Grid container item justifyContent="flex-end" md={2}>
        <Tooltip content="Přidat záložku" target=".bookmark-add" position="left" />
        <Button onClick={props.addBookmark} className={`${buttonStyles.ctrBtn} bookmark-add`} size="small" style={{ float: "right" }}>
          <icons.BookmarkAdd />
        </Button>
      </Grid>
    </Grid>
  );
}

BookmarkPanel.propTypes = {
  setCurrentImageIndex: PropTypes.func.isRequired,
  addBookmark: PropTypes.func.isRequired,
};


// Connect the component using connect
export default connect(
  BookmarkPanelConnectors.mapStateToProps,
  BookmarkPanelConnectors.mapDispatchToProps,
)(BookmarkPanel);
