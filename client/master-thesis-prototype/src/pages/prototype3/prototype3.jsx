import React, { useEffect, useRef, useState } from 'react';

import { Grid } from '@mui/material';
import Textbox from '@components/textbox/textbox';
import PinZoomWrapper from '@wrappers/PinZoomWrapper/PinZoomWrapper';
import ImageViewerHelp from '@components/imageViewerHelp/imageViewerHelp';
import './prototype3.css';
import KeyboardService from '@services/KeyboardListenerService';
import { connect, useDispatch } from 'react-redux';
import FiltersMenu from '../../components/filtersMenu/filtersMenu';
import NavigationNotch from '@components/navigationNotch/navigationNotch';
import useDynamicGridSize from '@hooks/useDynamicGridSize';
import ControlMenu from '../../components/controlMenu/controlMenu';
import Prototype3Connectors from './prototype3Connectors';
import GalleryImage from '../../components/galleryImage/galleryImage';
import SideBar from '../../components/sideBar/sideBar';
import PropTypes from 'prop-types';

const Prototype3 = (props) => {
  const containerRef = useRef(null);
  const [textboxes, setTextboxes] = useState([]);

  const dispatch = useDispatch();
  const keyboardService = new KeyboardService(dispatch);

  const [noteLayerVisibility] = useState(true);

  const mdSize = useDynamicGridSize(8, props.isFilterPanelOpen, props.isSidePanelOpen);
  
  /*
  const onLoad = (e) => {
    setImage({
      width: e.target.naturalWidth,
      height: e.target.naturalHeight,
    });
  };*/


  /*
  useEffect(() => {
    preloadImage(files, 0)
  }, [])*/


  useEffect(() => {
    keyboardService.startListening();
    return () => keyboardService.stopListening();
  }, [KeyboardService]);


 

  /*
  const addTextBox = (e) => {

    //cannot add note when note layers is not visible
    if (!noteLayerVisibility) {
      return;
    }


    // FIX COORDS

    const rect = containerRef.current.getBoundingClientRect();
    //const scaleX = image.width / rect.width;
    //const scaleY = image.height / rect.height;

    // Calculate the mouse coordinates relative to the image
    const x = (e.clientX - rect.left) * position.z;
    const y = (e.clientY - rect.top) * position.z;

    // Now 'x' and 'y' contain the mouse coordinates relative to the image
    console.log(`Mouse coordinates relative to the image: x=${x}, y=${y}`);

    // END OF FIX COORDS


    // Create a new textbox on mouse click
    console.log("Click coords: X=", e.clientX, ", Y=", e.clientY)

    const newTextbox = {
      x: x,//(e.clientX - position.x) * position.z,
      y: y,//(e.clientY - position.y) * position.z,
      width: 100, // Set your default width
      height: 50, // Set your default height
      text: 'Vložte text', // Set your default text
    };
    console.log("new textbox: ", newTextbox)
    setTextboxes([...textboxes, newTextbox]);
  };
  */


  return (
    <div>
      <ControlMenu />

      <Grid container>
        <SideBar />

        <Grid item md={mdSize} ref={containerRef}>

          <PinZoomWrapper position={props.position} setPosition={props.updatePosition}>
            <GalleryImage />
            {noteLayerVisibility && textboxes.map((textbox, index) => (
              <Textbox key={"texbox_"+index} textbox={textbox} index={index} setTextboxes={setTextboxes} />
            ))}
          </PinZoomWrapper>
        </Grid>

        <Grid item md={2}>
          <FiltersMenu />
        </Grid>

      </Grid>

      <NavigationNotch />

      <ImageViewerHelp />

    </div >
  );
};

Prototype3.propTypes = {
  position: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    z: PropTypes.number.isRequired,
  }).isRequired,
  updatePosition: PropTypes.func.isRequired,
};

export default connect(
  Prototype3Connectors.mapStateToProps,
  Prototype3Connectors.mapDispatchToProps,
)(Prototype3);
