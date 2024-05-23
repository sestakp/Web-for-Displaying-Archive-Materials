import ArchivalRecordDetail from "../models/ArchivalRecord/ArchivalRecordDetail";




const FullResolutionImageDownload = async (detail: ArchivalRecordDetail | undefined, pageIndex: number) => {
    // Fetch DZI information
    if (detail?.scans != undefined) {



        const dziUrl = `${process.env.REACT_APP_PROXY_URL}/proxy?url=${detail.scans[pageIndex].url}`;
        
        
        
        const response = await fetch(dziUrl);
        if(dziUrl.includes("ebadatelna.soapraha.cz") || dziUrl.includes("images.soalitomerice.cz") || dziUrl.includes("images.archives.cz")){
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = `portaarchiva_sig_${detail.signature}_${pageIndex + 1}.jpg`; // Specify the filename here
            a.style.display = 'none';
            document.body.appendChild(a);

            a.click();

            // Clean up
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            return;
        }
        
        
        
        
        const dziXml = await response.text();

        // Parse DZI XML to get width, height, and tile size
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(dziXml, 'text/xml');
        const sizeElement = xmlDoc.querySelector('Size');
        const width = parseInt(sizeElement?.getAttribute('Width') ?? "", 10);
        const height = parseInt(sizeElement?.getAttribute('Height') ?? "", 10);
        const tileSize = parseInt(xmlDoc.documentElement.getAttribute('TileSize') ?? "", 10);

        // Fetch tiles of the highest resolution directly
        const level = Math.ceil(Math.max(width, height) / tileSize);

        // Assemble the image
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext('2d');

        const numTilesX = Math.ceil(width / tileSize);
        const numTilesY = Math.ceil(height / tileSize);

        const downloadTile = async (x: number, y: number) => {
            const tileUrl = `${dziUrl.replace(".dzi", "_files")}/${level}/${x}_${y}.jpg`; // Adjust the URL pattern based on your DZI structure
            const response = await fetch(tileUrl);
            const blob = await response.blob();
            return createImageBitmap(blob);
        };

        // Download tiles of the highest resolution only
        for (let x = 0; x < numTilesX; x++) {
            for (let y = 0; y < numTilesY; y++) {
                const tile = await downloadTile(x, y);
                context?.drawImage(tile, x * tileSize, y * tileSize, tileSize, tileSize);
            }
        }

        const assembledDataURL = canvas.toDataURL('image/jpeg');
        const downloadLink = document.createElement('a');
        downloadLink.href = assembledDataURL;
        downloadLink.download = `portaarchiva_sig_${detail.signature}_${pageIndex + 1}.jpg`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }
};

export default FullResolutionImageDownload;