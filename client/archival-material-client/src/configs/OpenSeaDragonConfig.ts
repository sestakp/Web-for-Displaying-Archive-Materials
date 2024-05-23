import { Options } from 'openseadragon';
import isMobile from '../utils/isMobile';




const getOpenSeaDragonConfig = (tileSources: string[] | string | any, initialPage: number): Options => {


    return {
        id: 'archive-viewer', // Provide the ID of the container element
        tileSources, // Path to your Deep Zoom Image (DZI) file
        preserveViewport: true, //lock zoom and pan position when changing screen
        showNavigationControl: false,

        maxZoomLevel: 25,
        showNavigator: ! isMobile(),
        navigatorSizeRatio: 0.15,
        initialPage,
        autoResize: true,

        preserveOverlays: true,      

        sequenceMode: true,
        showSequenceControl: false,
        //sequenceControlAnchor: OpenSeaDragon.ControlAnchor.TOP_RIGHT,
        animationTime: 0.15,
        //referenceStripPosition: "TOP_RIGHT",
        
        gestureSettingsMouse: {
            clickToZoom: true,
            flickEnabled: true,
            pinchToZoom: true,
            scrollToZoom: true,
        },
          gestureSettingsTouch: {
            clickToZoom: true,
            flickEnabled: true,
            pinchToZoom: true,
            scrollToZoom: true,
        },


        showReferenceStrip: ! isMobile(),
        referenceStripSizeRatio: 0.20,
        referenceStripScroll: "vertical",
        
        
        
        autoHideControls: true,
        navigatorAutoFade: true,
        controlsFadeDelay: 0.5,
    }
}

export default getOpenSeaDragonConfig;