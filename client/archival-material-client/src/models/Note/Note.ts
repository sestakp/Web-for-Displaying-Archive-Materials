import AccessibilityEnum from "../AccessibilityEnum";




export default interface Note{
    id?: number;
    scanUrl: string;
    data: string;
    archivalRecordId: number;
    accessibility: AccessibilityEnum;
    pageNumber?: number;
}