import { useState } from "react";
import ScanDto from "../../models/Scan/ScanDto";
import {
    fabric,
    initFabricJSOverlay,
} from '@sestakp/openseadragon-fabricjs-overlay';
import OpenSeaDragon from 'openseadragon';
import getOpenSeaDragonConfig from "../../configs/OpenSeaDragonConfig";
import updateScanNumbers from "../../utils/updateScanNumbers";
import usePagination from "./subHooks/usePagination";
import useUndoRedo from "./subHooks/useUndoRedo";
import useZoom from "./subHooks/useZoom";
import useRotation from "./subHooks/useRotation";
import useNotes from "./subHooks/useNotes";
import useFullScreen from "./subHooks/useFullScreen";
import usePreserveViewport from "./subHooks/usePreserveViewport";


export default function useDrawingOpenSeaDragon(){
    

    const [viewer, setViewer] = useState<any>(undefined);
    const [fabricCanvas, setFabricCanvas] = useState<any>(undefined);
    const [showSettings, setShowSettings] = useState<boolean>(true);
    
    const [displayNavigation, setDisplayNavigation] = useState<boolean>(true);
    const [displayPreviews, setDisplayPreviews] = useState<boolean>(true);



    const pagination = usePagination(viewer);
    const undoRedo = useUndoRedo(fabricCanvas);
    const zoom = useZoom(viewer);
    const rotation = useRotation(fabricCanvas, viewer);
    const notes = useNotes(viewer, fabricCanvas, pagination.pageIndex, pagination.prevPageIndex, displayPreviews, displayNavigation, undoRedo.setHistory, undoRedo.saveCanvasState, pagination.setPrevPageIndex, undoRedo.setCurrentState, rotation.rotation)
    const fullscreen = useFullScreen();
    const preserveViewport = usePreserveViewport(viewer, pagination.setPageIndex)

    const initializeViewer = (scans: ScanDto[] | undefined) => {
        if (scans) {
            
            
            const urls = scans.map((dziUrl) => {

                if(dziUrl.preFetchUrl != undefined && dziUrl.preFetchUrl != ""){
                    fetch(`${process.env.REACT_APP_PROXY_URL}/proxy?url=${dziUrl.preFetchUrl}`)
                }
                
                if(dziUrl.url.includes("ebadatelna.soapraha.cz") || dziUrl.url.includes("images.soalitomerice.cz") || dziUrl.url.includes("images.archives.cz")){
                    return {
                        
                        type: 'image',
                        url:  `${process.env.REACT_APP_PROXY_URL}/proxy?url=${dziUrl.url}`,
                        buildPyramid: false
                    }
                }
                return `${process.env.REACT_APP_PROXY_URL}/proxy?url=${dziUrl.url}`;
            });
        
            viewer?.destroy();

            fabric.Object.prototype.set({
                borderColor: '#22a2f8',
                borderScaleFactor: 2, // selection stroke width
                cornerColor: 'white',
                cornerSize: 10,
                transparentCorners: false,
            });

            fabric.Canvas.prototype.set({
                // When true, hover activated only on actual shape, not bounding box
                perPixelTargetFind: true,
            });

            initFabricJSOverlay(OpenSeaDragon, fabric);
        
            
            const newViewer = OpenSeaDragon(getOpenSeaDragonConfig(urls, pagination.pageIndex)) as any;

            const overlay = newViewer.fabricjsOverlay({ scale: 1 })
            setFabricCanvas(overlay.fabricCanvas());

            undoRedo.saveCanvasState(overlay.fabricCanvas());
            newViewer.setMouseNavEnabled(true);
            newViewer.outerTracker.setTracking(true);

            newViewer.gestureSettingsByDeviceType("mouse").clickToZoom = false;

            zoom.setZoom(newViewer.viewport.getZoom(true));

            newViewer.addHandler('viewport-change', () => {
                const currentZoom = newViewer?.viewport.getZoom(true);

                if (currentZoom != undefined) {
                    zoom.setZoom(currentZoom);
                }
            });

            newViewer.addHandler('rotate', (e: any) => {
                rotation.setRotation(e.degrees);
            });


            // Disable keyboard shortcuts
            newViewer.innerTracker.keyDownHandler = null;
            newViewer.innerTracker.keyPressHandler = null;
           
            updateScanNumbers(newViewer)             
                      
           
            setViewer(newViewer);
        }
    };

    const destroyViewer = () => {
        if (viewer != undefined) {
            notes.storeCurrentCanvas(false);
            viewer.destroy();
        }
    }

    return {
        viewer,
        initializeViewer,
        destroyViewer,
        ...pagination,
        ...undoRedo,
        ...zoom,
        ...rotation,
        ...notes,
        ...fullscreen,
        ...preserveViewport,
        showSettings,
        setShowSettings,
        setDisplayNavigation,
        setDisplayPreviews
    }
}