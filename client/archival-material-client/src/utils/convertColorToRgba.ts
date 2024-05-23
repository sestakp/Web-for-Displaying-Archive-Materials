



export default function convertColorToRgba(colorString: string, opacity = 1) {
    // Remove the leading '#' character (if present)
    const hex = colorString.startsWith('#') ? colorString.slice(1) : colorString;

    // Validate the hex string length
    if (hex.length !== 6) {
        throw new Error('Invalid hex color string');
    }

    // Convert each hex digit to integer (0-255)
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);

    // Return RGBA string with specified opacity
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}