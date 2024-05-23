

export default function updateScanNumbers(viewerObj: any){
    const referenceStrip = viewerObj?.referenceStrip?.element;
    if(referenceStrip != undefined){
        const childrenArray = Array.from(referenceStrip.children);
    
        childrenArray.forEach((element: any, i) => {
            const numberOverlay = document.createElement('div');
            numberOverlay.style.position = 'absolute';
            numberOverlay.style.right = '10px';
            numberOverlay.style.bottom = '10px';
            numberOverlay.style.backgroundColor = 'white';
            numberOverlay.style.borderRadius = '50%';
            numberOverlay.style.width = "30px";
            numberOverlay.style.height = "30px";
            numberOverlay.style.padding = '5px';
            numberOverlay.style.textAlign = 'center';
            numberOverlay.style.zIndex = '50';
            numberOverlay.textContent = (i + 1).toString();
            element.appendChild(numberOverlay);
        });
    }
}