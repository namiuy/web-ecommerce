export const getObjectDifference = (originalObj: any, newObj: any): Record<string, any> => {
  const differences: Record<string, any> = {};

  const isEqual = (a: any, b: any, key?: string): boolean => {
    // Comparación especial para arrays
    if (Array.isArray(a) && Array.isArray(b)) {
      return JSON.stringify(a) === JSON.stringify(b);
    }

    // Comparación para objetos
    if (typeof a === 'object' && typeof b === 'object' && a !== null && b !== null) {
      return JSON.stringify(a) === JSON.stringify(b);
    }

    return a == b;
  };

  for (const key in originalObj) {
    if (!newObj.hasOwnProperty(key)) continue;

    if (!isEqual(originalObj[key], newObj[key], key)) {
      differences[key] = newObj[key];
    }
  }

  for (const key in newObj) {
    if (!originalObj.hasOwnProperty(key)) {
      differences[key] = newObj[key];
    }
  }

  return differences;
};
