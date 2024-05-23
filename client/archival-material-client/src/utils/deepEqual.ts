export default function deepEqual(obj1: any, obj2: any) {
    // Check if both are of the same type
    if (typeof obj1 !== typeof obj2) {
      return false;
    }
  
    // If both are primitive values, compare directly
    if (typeof obj1 !== "object" || obj1 === null || obj2 === null) {
      return obj1 === obj2;
    }
  
    // If both are arrays, compare their elements recursively
    if (Array.isArray(obj1) && Array.isArray(obj2)) {
      if (obj1.length !== obj2.length) {
        return false;
      }
      for (let i = 0; i < obj1.length; i++) {
        if (!deepEqual(obj1[i], obj2[i])) {
          return false;
        }
      }
      return true;
    }
  
    // If both are objects, compare their properties recursively
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
  
    // Check if they have the same number of properties
    if (keys1.length !== keys2.length) {
      return false;
    }
  
    // Compare each property value recursively
    for (const key of keys1) {
      if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
        return false;
      }
    }
  
    return true;
  }