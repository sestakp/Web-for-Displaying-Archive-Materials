import { useEffect, useState } from "react";
import LayerEnum from "../../../models/LayerEnum";
import DrawToolEnum from "../../../models/DrawToolEnum";
import isMobile from "../../../utils/isMobile";
import useArchivalRecordSelector from "../../../store/archivalRecord/hooks/archivalRecordSelectorHook";
import useNoteSelector from "../../../store/note/hooks/noteSelectorHook";
import convertColorToRgba from "../../../utils/convertColorToRgba";
import {
    fabric,
} from '@sestakp/openseadragon-fabricjs-overlay';
import useNoteActions from "../../../store/note/hooks/noteActionHook";
import AccessibilityEnum from "../../../models/AccessibilityEnum";
import deepEqual from "../../../utils/deepEqual";
import { useLocation, useNavigate } from "react-router-dom";
import TODO from "../../../models/TODO";
import updateUrlParamScanIndex from "../../../utils/updateUrlParamScanIndex";
import useKeyboardShortcut from "../../useKeyboardShortcut/useKeyboardShortcut";

export default function useNotes(viewer: any, 
    fabricCanvas: any, 
    pageIndex : number, 
    prevPageIndex: number, 
    displayPreviews: boolean, 
    displayNavigation: boolean, 
    setHistory: TODO, 
    saveCanvasState: TODO,
    setPrevPageIndex: TODO,
    setCurrentState: TODO, 
    rotation: number
 ){

    const archivalRecordSelector = useArchivalRecordSelector()
    const noteSelector = useNoteSelector()
    const noteActions = useNoteActions()
    const location = useLocation()
    const navigate = useNavigate()

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
            viewer.referenceStrip.element.style.display = (displayPreviews && activeTool == DrawToolEnum.MOVE) ? "block" : "none"
        }
    },[viewer, displayPreviews, activeTool])

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
        if(! overlayVisible && fabricCanvas != undefined){
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


     /* when overlay visible is changed, we need to update handler which create new note, else user is able to create new notes when overlay is hidden */
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



    useKeyboardShortcut('Delete', deleteSelectedNote);
    useKeyboardShortcut('Escape', () => setActiveTool(DrawToolEnum.MOVE));
    useKeyboardShortcut('o', toggleOverlayVisible);

    return {
        storeCurrentCanvas,
        highlighterPresets,
        highlightColor,
        setHighlightColor,
        drawPresets,
        drawColor,
        setDrawColor,
        activeTool,
        overlayVisible,
        toggleOverlayVisible,
        activeLayer,
        setActiveTool,
        rotation,
        drawingFontSize,
        setDrawingFontSize,
        highlightingFontSize,
        setHighlightingFontSize,
        textboxTextPresets,
        textboxTextColor,
        textboxBackgroundPresets,
        textboxBackgroundColor,
        setTextboxTextColor,
        setTextboxBackgroundColor,
        setActiveLayer,
    }

}