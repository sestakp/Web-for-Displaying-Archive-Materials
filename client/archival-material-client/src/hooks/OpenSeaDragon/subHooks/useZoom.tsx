import { useState } from "react";
import useKeyboardShortcut from "../../useKeyboardShortcut/useKeyboardShortcut";



export default function useZoom(viewer: any){

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

    function getZoom(){
        return viewer.viewport.getZoom(true)
    }


    useKeyboardShortcut('+', zoomIn);
    useKeyboardShortcut('-', zoomOut);

    return {
        zoomIn,
        zoomOut,
        getZoom,
        setZoom,
        zoom
    }

}