
/**
 * Generate an array of numbers around a specified index within a given range.
 *
 * @param {number} index - The central index around which the numbers will be generated.
 * @param {number} min - The minimum value of the range.
 * @param {number} max - The maximum value of the range.
 * @param {number} count - The total count of numbers to generate.
 * @returns {number[]} An array of numbers centered around the index within the specified range.
 */
export default function generateNumbersAroundIndex(index: number, min: number, max: number, count: number): number[] {
    const result = [];
  
    // Ensure the count is an odd number to have the index in the middle
    const isEvenCount = count % 2 === 0;
    const adjustedCount = isEvenCount ? count - 1 : count;
  
    // Calculate the range around the index
    const range = Math.floor(adjustedCount / 2);
  
    // Determine the starting point for the loop
    let start = Math.max(min, index - range);
  
    // If the range is not sufficient to reach the minimum, adjust the starting point
    start = Math.max(min, start - Math.max(0, range - (index - min)));
  
    // Ensure the starting point is within the specified range
    start = Math.min(start, max - adjustedCount + 1);
  
    // Loop to generate numbers
    for (let i = 0; i < adjustedCount; i++) {
      const currentNumber = start + i;
  
      // Ensure the generated number is within the specified range
      if (currentNumber >= min && currentNumber <= max) {
        result.push(currentNumber);
      }
    }
  
    return result;
  }
  