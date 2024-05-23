




export default function formatTimeRange(timeRange: any): string | null{
    let rangeString = ""

    if(timeRange != null){
        if(timeRange.from != null && timeRange.from != 0){
            rangeString = timeRange.from.toString();
        }

        if(timeRange.to != null && timeRange.to != 0){
            rangeString = rangeString + " - " + timeRange.to.toString();
        }
        
    }

    if(rangeString != ""){
        return rangeString
    }

    return null;


}