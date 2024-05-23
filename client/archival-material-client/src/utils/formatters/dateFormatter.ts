


export default function dateFormatter(dateString: string | undefined){
    if(dateString == undefined){
        return ""
    }
    
    const date = new Date(dateString);

    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1; // Months are zero-based, so we add 1
    const year = date.getUTCFullYear();
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCHours()).padStart(2, '0');
    
    const formattedDate = `${day}.${month}.${year} ${hours}:${minutes}`;
    return formattedDate
}