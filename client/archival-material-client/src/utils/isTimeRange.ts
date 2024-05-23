import TimeRange from "../models/TimeRange";






export default function isTimeRange(value: any): value is TimeRange {
    return typeof value === 'object' && value !== null && 'from' in value && 'to' in value;
}