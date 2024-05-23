export default {}
/*
import { useEffect, useRef, useState } from 'react';
import OpenSeaDragon, { CanvasKeyEvent, TileSource } from 'openseadragon';
import getOpenSeaDragonConfig from '../../configs/OpenSeaDragonConfig';
import useArchivalRecordSelector from '../../store/archivalRecord/hooks/archivalRecordSelectorHook';
import {
    fabric,
    initFabricJSOverlay,
} from '@sestakp/openseadragon-fabricjs-overlay';
import logger from '../../utils/loggerUtil';
import DrawToolEnum from '../../models/DrawToolEnum';
import convertColorToRgba from '../../utils/convertColorToRgba';
import useNoteActions from '../../store/note/hooks/noteActionHook';
import useNoteSelector from '../../store/note/hooks/noteSelectorHook';
import deepEqual from '../../utils/deepEqual';
import LayerEnum from '../../models/LayerEnum';
import AccessibilityEnum from '../../models/AccessibilityEnum';
import ScanDto from '../../models/Scan/ScanDto';
import OpenSeadragon from 'openseadragon';
import useKeyboardShortcut from '../useKeyboardShortcut/useKeyboardShortcut';
import { faB } from '@fortawesome/free-solid-svg-icons';
import { text } from 'stream/consumers';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import updateUrlParamScanIndex from '../../utils/updateUrlParamScanIndex';
import isMobile from '../../utils/isMobile';
import updateScanNumbers from '../../utils/updateScanNumbers';

export const useOpenSeadragonViewer = () => {


    // INITIALIZATION 
    const [viewer, setViewer] = useState<any>(undefined);
    const [fabricCanvas, setFabricCanvas] = useState<any>(undefined);

    const [displayNavigation, setDisplayNavigation] = useState<boolean>(true);
    const [displayPreviws, setDisplayPreviews] = useState<boolean>(true);

    const archivalRecordSelector = useArchivalRecordSelector();

    const noteActions = useNoteActions();
    const noteSelector = useNoteSelector();

    
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
        
            
            const newViewer = OpenSeaDragon(getOpenSeaDragonConfig(urls, pageIndex)) as any;

            const overlay = newViewer.fabricjsOverlay({ scale: 1 })
            setFabricCanvas(overlay.fabricCanvas());

            saveCanvasState(overlay.fabricCanvas());
            newViewer.setMouseNavEnabled(true);
            newViewer.outerTracker.setTracking(true);

            newViewer.gestureSettingsByDeviceType("mouse").clickToZoom = false;

            setZoom(newViewer.viewport.getZoom(true));

            newViewer.addHandler('viewport-change', () => {
                const currentZoom = newViewer?.viewport.getZoom(true);

                if (currentZoom != undefined) {
                    setZoom(currentZoom);
                }
            });

            newViewer.addHandler('rotate', (e: any) => {
                setRotation(e.degrees);
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
            storeCurrentCanvas(false);
            viewer.destroy();
        }
    }

    // END OF INITIALIZATION





    //PAGINATION

    const scanIndex  = Number(useParams().scanIndex);
    const [pageIndex, setPageIndex] = useState<number>(scanIndex - 1);
    const [prevPageIndex, setPrevPageIndex] = useState<number>(scanIndex);

    function previousPage() {
        if (viewer != undefined) {
            if (viewer.currentPage() > 0) {

                viewer.goToPage(viewer.currentPage() - 1)
            }
        }
    }

    function nextPage() {
        if (viewer != undefined) {
            if (archivalRecordSelector.detail?.scans?.length != undefined) {
                if (viewer.currentPage() < (archivalRecordSelector.detail.scans.length - 1)) {
                    viewer.goToPage(viewer.currentPage() + 1)
                }
            }
        }
    }

    const navigate = useNavigate();

    const location = useLocation();

    function goToPage(pageNumber:number) {
        console.log("go to page")
        if (viewer !== undefined && pageNumber !== undefined && pageNumber >= 0) {
          const totalPages = archivalRecordSelector.detail?.scans?.length || 0;
          if (pageNumber < totalPages) {
            
            
            viewer.goToPage(pageNumber);
          } else {
            console.warn("Invalid page number. Page number cannot be greater than the total number of pages.");
          }
        } else {
          console.warn("Invalid function call. Ensure viewer and pageNumber are defined and positive.");
        }
      }


    //END OF PAGINATION


    // UNDO / REDO

    const [history, setHistory] = useState<string[]>([]);
    const [currentState, setCurrentState] = useState(-1);

    const saveCanvasState = (c: any) => {

        if (c != undefined) {
            const state = JSON.stringify(c);
            setHistory((prevHistory) => {
                const newHistory = prevHistory.slice(0, currentState + 1);
                newHistory.push(state);
                setCurrentState(newHistory.length - 1);
                return newHistory;
            });
        }
        return history;
    };

    const handleCanvasChange = () => {
        saveCanvasState(fabricCanvas);
    };

    useEffect(() => {
        
        if (fabricCanvas) {
            fabricCanvas.on('object:added', handleCanvasChange);
            fabricCanvas.on('object:removed', handleCanvasChange);
            fabricCanvas.on('object:modified', handleCanvasChange);
        }

        return () => {
            if (fabricCanvas) {
                fabricCanvas.off('object:added', handleCanvasChange);
                fabricCanvas.off('object:removed', handleCanvasChange);
                fabricCanvas.off('object:modified', handleCanvasChange);
            }
        };
    }, [fabricCanvas, currentState])

    const undo = () => {
        if ((currentState > 0) && fabricCanvas) {

            //Event listeners must be removed, because loadFromJson calling object:added, and its broking undo and redo
            const oldListeners = fabricCanvas.__eventListeners;
            fabricCanvas.__eventListeners = {}

            setCurrentState((prev) => prev - 1);
            const state = JSON.parse(history[currentState - 1]);
            fabricCanvas.loadFromJSON(state, () => {
                fabricCanvas.renderAll.bind(fabricCanvas)
                fabricCanvas.__eventListeners = oldListeners; //give back restored event listeners
            });
        }
    };

    const redo = () => {

        if ((currentState < history.length - 1) && fabricCanvas) {
        
            //Event listeners must be removed, because loadFromJson calling object:added, and its broking undo and redo    
            const oldListeners = fabricCanvas.__eventListeners;
            fabricCanvas.__eventListeners = {}

            setCurrentState((prev) => prev + 1);
            const state = JSON.parse(history[currentState + 1]);
            fabricCanvas.loadFromJSON(state, () => {
                fabricCanvas.renderAll.bind(fabricCanvas)
                fabricCanvas.__eventListeners = oldListeners; //give back restored event listeners
            });
        }

    };

    //END OF UNDO / REDO

    // NOTES 

    //@see
    //https://www.npmjs.com/package/@adamjarling/openseadragon-fabricjs-overlay

    const [overlayVisible, setOverlayVisible] = useState<boolean>( ! isMobile() );
    const [isOverlayItemSelected, setIsOverlayItemSelected] = useState<boolean>(false);

    const [highlightingFontSize, setHighlightingFontSize] = useState<number>(80);
    const highlighterPresets = ['#e3ff00', '#56ff00', '#00f9ff', '#ff00db', '#bd00ff'];
    const [highlightColor, setHighlightColor] = useState<string>(highlighterPresets[0]);


    const [drawingFontSize, setDrawingFontSize] = useState<number>(12);
    const drawPresets = ['#ff1010', '#ffa700', '#2fff00', '#0067db', '#b000ff'];
    const [drawColor, setDrawColor] = useState<string>(drawPresets[0]);

    const textboxTextPresets = ['#663300', '#006600', '#000066', '#660000', '#333333'];
    const [textboxTextColor, setTextboxTextColor] = useState<string>(textboxTextPresets[0])

    const textboxBackgroundPresets = ['#FFFFCC', '#CCFFCC', '#CCE5FF', '#FFCCCC', '#E0E0E0'];
    const [textboxBackgroundColor, setTextboxBackgroundColor] = useState<string>(textboxBackgroundPresets[0])


    const [activeLayer, setActiveLayer] = useState<LayerEnum>(LayerEnum.PUBLIC);

    const [activeTool, setActiveTool] = useState<DrawToolEnum>(DrawToolEnum.MOVE);


    useEffect(() => {
        if(viewer != undefined && viewer.referenceStrip != undefined){
            viewer.referenceStrip.element.style.display = (displayPreviws && activeTool == DrawToolEnum.MOVE) ? "block" : "none"
        }
    },[viewer, displayPreviws, activeTool])

    useEffect(() => {
        if(viewer != undefined && viewer.navigator != undefined){
            viewer.navigator.element.style.display = (displayNavigation && activeTool == DrawToolEnum.MOVE) ? "block" : "none"
        }
    },[viewer, displayNavigation, activeTool])

    function selectItem() {
        if (fabricCanvas) {
            setIsOverlayItemSelected(true);
            fabricCanvas.renderAll(); // Ensure re-render
        }
    }

    function deselectItem() {
        if (fabricCanvas) {
            setIsOverlayItemSelected(false);
            fabricCanvas.renderAll(); // Ensure re-render
        }
    }

    useEffect(() => {
        
        if (fabricCanvas) {
            fabricCanvas.on('selection:created', selectItem);
            fabricCanvas.on('selection:cleared', deselectItem);
        }

        return () => {
            if (fabricCanvas) {
                fabricCanvas.off('selection:created', selectItem);
                fabricCanvas.off('selection:cleared', deselectItem);
            }
        };
    }, [fabricCanvas])

    
    function storeCurrentCanvas(usePrevPageIndex = true, actLayer = activeLayer){
        
        if(archivalRecordSelector.detail?.scans != undefined && fabricCanvas != undefined){
            
            const data = fabricCanvas.toJSON();
            const index = usePrevPageIndex ? prevPageIndex : pageIndex;
            const prevScanUrl = archivalRecordSelector.detail.scans[index];
            
            const accessibility = actLayer == LayerEnum.PUBLIC ? AccessibilityEnum.PUBLIC : AccessibilityEnum.PRIVATE;

            const prevNotes = noteSelector.notes.find(note => note.scanUrl == prevScanUrl.url && note.accessibility == accessibility);

            if(prevNotes?.data != undefined){

                const prevData = JSON.parse(prevNotes?.data)
                if( ! deepEqual(prevData, data)){
                    noteActions.upsertNote(archivalRecordSelector.detail.scans[index].url, JSON.stringify(data), accessibility)
                }
            }
            else{
                if(data.objects.length > 0){
                    noteActions.upsertNote(archivalRecordSelector.detail.scans[index].url, JSON.stringify(data), accessibility)
                }
            }
        }
    }

    useEffect(() => {
        if(pageIndex != prevPageIndex && overlayVisible && fabricCanvas){
            storeCurrentCanvas()

            fabricCanvas.clear();
            
            setCurrentState(-1);
            setHistory([]);
            saveCanvasState(fabricCanvas)
            setPrevPageIndex(pageIndex);

            const currentUrl = location.pathname;
            const updatedUrl = updateUrlParamScanIndex(currentUrl, pageIndex + 1)
            navigate(updatedUrl, { replace: true });
        }
    },[pageIndex])

    
    useEffect(() => {
        if(! overlayVisible){
            storeCurrentCanvas(false)

            fabricCanvas.clear();
            
            setCurrentState(-1);
            setHistory([]);
            saveCanvasState(fabricCanvas)
            setPrevPageIndex(pageIndex);
        }
    },[overlayVisible])

    useEffect(() => {
        if(fabricCanvas != undefined){
            
            storeCurrentCanvas(false, activeLayer == LayerEnum.PRIVATE ? LayerEnum.PUBLIC : LayerEnum.PRIVATE)

            fabricCanvas.clear();
            
            setCurrentState(-1);
            setHistory([]);
            saveCanvasState(fabricCanvas)
        }
    },[activeLayer])

    
    useEffect(() => {
        
        const currentScan = archivalRecordSelector.detail?.scans?.[pageIndex]
        const accessibility = activeLayer == LayerEnum.PUBLIC ? AccessibilityEnum.PUBLIC : AccessibilityEnum.PRIVATE;

        if(currentScan != undefined && fabricCanvas != undefined){
            const note = noteSelector.notes.find(note => note.scanUrl == currentScan.url && note.accessibility == accessibility)
            if(note != undefined && overlayVisible){
                const parsedData = JSON.parse(note.data);
    
                fabricCanvas.loadFromJSON(parsedData, function() {
                    fabricCanvas.renderAll();
                  });
            }
        }
        
    },[noteSelector.notes,archivalRecordSelector.detail,  overlayVisible, fabricCanvas, activeLayer, pageIndex])

    const toggleOverlayVisible = () => {
        setOverlayVisible(old => !old);
    }

    const createNote = (x: number, y: number, overlayVisible: boolean) => {
        if (overlayVisible && fabricCanvas != undefined) {

            //TODO... update rotation

            let radians = fabric.util.degreesToRadians(rotation);
    
            // Get the center coordinates of the viewer's viewport
            let viewportCenter = viewer.viewport.getCenter();
    
            // Loop through all objects on the canvas
            // Calculate the position of the object relative to the viewer's viewport center
            let textboxOrigin = new fabric.Point(x - viewportCenter.x, y - viewportCenter.y);

            // Rotate the object position around the viewer's viewport center
            let rotatedPosition = fabric.util.rotatePoint(textboxOrigin, viewportCenter, radians);


            const textbox = new fabric.Textbox('', {
                left: rotatedPosition.x,
                top: rotatedPosition.y,
                width: 200,
                backgroundColor: convertColorToRgba(textboxBackgroundColor, 0.9),//"rgba(0,0,0,0.9)",
                //color: "red",
                fill: convertColorToRgba(textboxTextColor, 1),//'red',
                textAlign: 'center',
                overflow: 'ellipsis',
                fontSize: 80,
                defaultOptions: {
                    placeholderText: 'Zde vložte Vaši poznámku'
                }
            });
            
            fabricCanvas.add(textbox);
            fabricCanvas.setActiveObject(textbox);
        }
    };


    const updateFontSizeOnSelectedNote = (fontSize: number) => {
        const selectedObject = getSelectedNote()
        if (selectedObject != undefined) {
            selectedObject.fontSize = fontSize
        }
    };

    const deleteSelectedNote = () => {
        if(fabricCanvas){
            const selectedObject = getSelectedNote()
            if (selectedObject != undefined) {
                fabricCanvas.remove(selectedObject)
            }
        }

    };

    const getSelectedNote = () => {
        if (fabricCanvas != undefined) {
            return fabricCanvas.getActiveObject();
        }
        return undefined;
    };



    // END OF NOTES 

    //  ROTATION 

    function rotateCanvas(degrees: number) {
        if (fabricCanvas != undefined && viewer != undefined) {
                        
            // Rotate the canvas
            //fabricCanvas.angle += degrees;
    
            // Convert degrees to radians
            let radians = fabric.util.degreesToRadians(degrees);
    
            // Get the center coordinates of the viewer's viewport
            let viewportCenter = viewer.viewport.getCenter();
    
            // Loop through all objects on the canvas
            fabricCanvas.getObjects().forEach((obj: any) => {
                // Calculate the position of the object relative to the viewer's viewport center
                let objectOrigin = new fabric.Point(obj.left - viewportCenter.x, obj.top - viewportCenter.y);
    
                // Rotate the object position around the viewer's viewport center
                let rotatedPosition = fabric.util.rotatePoint(objectOrigin, viewportCenter, radians);
    
                
                // Update the object angle
                obj.angle += degrees;


                // Update the object position
                obj.left = rotatedPosition.x + viewportCenter.x;
                obj.top = rotatedPosition.y + viewportCenter.y;
    
    
                // Update object's coordinates
                obj.setCoords();
            });
    
            // Render all objects
            fabricCanvas.renderAll();
        }
    }

    const [rotation, setRotation] = useState<number>(0);
    function rotate(angle: number) {
        if (viewer != undefined) {
            
            const currentRotation = viewer?.viewport.getRotation() ?? 0; //TODO ,.. apply difference of angles
            rotateCanvas(angle - currentRotation)
            viewer.viewport.setRotation(angle)
        }
    }

    function rotateLeft() {
        const currentRotation = viewer?.viewport.getRotation() ?? 0;
        
        const newRotation = (currentRotation - 90 + 360) % 360; // Ensure rotation stays in the range [0, 360)
        rotate(newRotation);
    }

    function rotateRight() {
        const currentRotation = viewer?.viewport.getRotation() ?? 0;
        const newRotation = (currentRotation + 90 + 360) % 360; // Ensure rotation stays in the range [0, 360)
        rotate(newRotation);
    }

    // END OF ROTATION


    // when overlay visible is changed, we need to update handler which create new note, else user is able to create new notes when overlay is hidden 
    useEffect(() => {
    
        if (viewer != undefined) {
            viewer.removeAllHandlers('canvas-double-click');

            if (activeTool == DrawToolEnum.TYPE) {
                viewer.addHandler('canvas-double-click', (event: any) => {

                    const viewportPoint = viewer.viewport.pointFromPixel(event.position);
                    const imagePoint = viewer.viewport.viewportToImageCoordinates(viewportPoint);
                    createNote(imagePoint.x, imagePoint.y, overlayVisible);
                });
            }

            if ((activeTool == DrawToolEnum.DRAW || activeTool == DrawToolEnum.HIGHLIGHT) && overlayVisible) {

                if (fabricCanvas != undefined) {
                    viewer.setMouseNavEnabled(false);
                    viewer.outerTracker.setTracking(false);
                    fabricCanvas.isDrawingMode = true;
                    fabricCanvas.freeDrawingBrush.color = activeTool == DrawToolEnum.DRAW ? convertColorToRgba(drawColor) : convertColorToRgba(highlightColor, 0.5)
                    fabricCanvas.freeDrawingBrush.width = activeTool == DrawToolEnum.DRAW ? drawingFontSize : highlightingFontSize;
                    fabricCanvas.renderAll();

                }
            }
            else{
                viewer.setMouseNavEnabled(true);
                viewer.outerTracker.setTracking(true);

                if (fabricCanvas != undefined) {
                    fabricCanvas.isDrawingMode = false;
                }
            }
        }
    }, [viewer, overlayVisible, activeTool, drawingFontSize, highlightingFontSize, highlightColor, drawColor, fabricCanvas, textboxBackgroundColor, textboxTextColor, rotation])


    // ZOOMING

    const [zoom, setZoom] = useState<number>(1);

    function zoomIn() {
        if (viewer != undefined) {
            viewer.viewport.zoomBy(1.2)
        }
    };

    function zoomOut() {
        if (viewer != undefined) {
            viewer.viewport.zoomBy(0.8)
        }
    };


    // END OF ZOOMING 


    // PRESERVE VIEWPORT

    const [preserveViewport, setPreserveViewport] = useState<boolean>(false);


    useEffect(() => {
        
        if (viewer != undefined) {
            viewer.removeAllHandlers('page');
            viewer.addHandler('page', (e: any): any => {

                if (!preserveViewport) {
                    reset()
                }
                setPageIndex(e.page)
            });
        }
    }, [viewer, preserveViewport])

    function togglePreserveViewport() {
        setPreserveViewport(old => !old);
    }

    // END OF PRESERVE VIEWPORT

    const [fullScreen, setFullScreen] = useState<boolean>(false);

    function toggleFullscreen() {
        if (document.fullscreenElement) { // Check if already in fullscreen
            document.exitFullscreen();
        } else {
            document.documentElement.requestFullscreen();
        }
        
    }

    function fullScreenChangeHandler(){
        const isFullscreen = document.fullscreenElement !== null;
        setFullScreen(isFullscreen);
    }

    useEffect(() => {
        document.addEventListener('fullscreenchange', fullScreenChangeHandler);

        return () => {
            document.removeEventListener("fullscreenchange", fullScreenChangeHandler);
        }
    }, [fullScreenChangeHandler])
    

    function reset() {
        viewer?.viewport.setRotation(0);
        viewer?.viewport.goHome();
        setPreserveViewport(false)


    }

    
    const [showSettings, setShowSettings] = useState<boolean>(true);

    useKeyboardShortcut('f', toggleFullscreen);
    useKeyboardShortcut('Delete', deleteSelectedNote);
    useKeyboardShortcut('ArrowLeft', previousPage);
    useKeyboardShortcut('ArrowRight', nextPage);
    useKeyboardShortcut('+', zoomIn);
    useKeyboardShortcut('-', zoomOut);
    useKeyboardShortcut('l', togglePreserveViewport);
    useKeyboardShortcut('o', toggleOverlayVisible);
    useKeyboardShortcut('e', rotateRight);
    useKeyboardShortcut('q', rotateLeft);

    return {
        viewer,
        rotation,
        zoom,
        pageIndex,
        preserveViewport,
        overlayVisible,
        isOverlayItemSelected,
        drawingFontSize,
        activeTool,
        highlightingFontSize,
        highlightColor,
        highlighterPresets,
        drawPresets,
        drawColor,
        textboxTextPresets,
        textboxTextColor,
        textboxBackgroundPresets,
        textboxBackgroundColor,
        showSettings,
        fullScreen,
        activeLayer,
        displayNavigation,
        displayPreviws,
        setDisplayNavigation,
        setDisplayPreviews,
        initializeViewer,
        rotateLeft,
        rotateRight,
        rotate,
        togglePreserveViewport,
        toggleFullscreen,
        reset,
        previousPage,
        nextPage,
        goToPage,
        zoomIn,
        zoomOut,
        createNote,
        toggleOverlayVisible,
        updateFontSizeOnSelectedNote,
        getSelectedNote,
        setActiveTool,
        deleteSelectedNote,
        setDrawingFontSize,
        setHighlightingFontSize,
        setHighlightColor,
        setDrawColor,
        setTextboxTextColor,
        setTextboxBackgroundColor,
        undo,
        redo,
        setShowSettings,
        destroyViewer,
        setActiveLayer,
        storeCurrentCanvas
    };
};

*/