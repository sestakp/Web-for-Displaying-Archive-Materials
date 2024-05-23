import {
    fabric
} from '@sestakp/openseadragon-fabricjs-overlay';
import { useState } from 'react';
import useKeyboardShortcut from '../../useKeyboardShortcut/useKeyboardShortcut';


export default function useRotation(fabricCanvas:any, viewer: any){


    const [rotation, setRotation] = useState<number>(0);

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

    
    useKeyboardShortcut('e', rotateRight);
    useKeyboardShortcut('q', rotateLeft);

    return {
        setRotation,
        rotateLeft,
        rotateRight,
        rotation,
        rotate
    }
}