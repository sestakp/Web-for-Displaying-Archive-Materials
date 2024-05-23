import { useEffect, useState } from "react";


export default function useUndoRedo(fabricCanvas: any){



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

    return {
        undo,
        redo,
        saveCanvasState,
        setCurrentState,
        setHistory
    }

}