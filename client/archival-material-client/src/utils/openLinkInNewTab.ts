


export default function openLinkInNewTab(url:string | undefined): void{
    if(url != undefined){
        window.open(url, '_blank');
    }
};