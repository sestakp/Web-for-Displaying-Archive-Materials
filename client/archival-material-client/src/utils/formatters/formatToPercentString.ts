






export default function formatToPercentString(input: number): string {
    const zoomInPercent = Math.round(input * 100);
    return `${zoomInPercent}%`
}

