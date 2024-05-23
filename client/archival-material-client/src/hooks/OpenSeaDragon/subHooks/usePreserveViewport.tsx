import { useEffect, useState } from "react";
import TODO from "../../../models/TODO";
import useKeyboardShortcut from "../../useKeyboardShortcut/useKeyboardShortcut";



export default function usePreserveViewport(viewer: any, setPageIndex: TODO){



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

    function reset() {
        viewer?.viewport.setRotation(0);
        viewer?.viewport.goHome();
        setPreserveViewport(false)


    }
    
    useKeyboardShortcut('l', togglePreserveViewport);

    return {
        togglePreserveViewport,
        setPreserveViewport,
        preserveViewport,
        reset
    }

}