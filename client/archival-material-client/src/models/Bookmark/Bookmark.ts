



export default interface Bookmark{
    id?:number;
    scanUrl: string;
    text: string;
    archivalRecordId: number;
    lastUpdated?: string;
    pageNumber?: number;
}