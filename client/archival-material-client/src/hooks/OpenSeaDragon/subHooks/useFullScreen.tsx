import { useEffect, useState } from "react";
import useKeyboardShortcut from "../../useKeyboardShortcut/useKeyboardShortcut";


export default function useFullScreen(){
    
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

    useKeyboardShortcut('f', toggleFullscreen);

    return {
        toggleFullscreen
    }
}