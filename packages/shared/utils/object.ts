export const getObjectDifference = (originalObj: any, newObj: any): Record<string, any> => {
  const differences: Record<string, any> = {};

  const isEqual = (a: any, b: any): boolean => {
    if (Array.isArray(a) && Array.isArray(b)) {
      return JSON.stringify(a.sort()) === JSON.stringify(b.sort());
    }
    if (typeof a === 'object' && typeof b === 'object' && a !== null && b !== null) {
      return JSON.stringify(a) === JSON.stringify(b);
    }
    return a == b; // Comparación flexible (2 == "2" es true, pero 2 === "2" es false)
  };

  for (const key in originalObj) {
    if (!newObj.hasOwnProperty(key)) {
      continue; // Si `newObj` no tiene la clave, la ignoramos
    }

    if (!isEqual(originalObj[key], newObj[key])) {
      differences[key] = newObj[key];
    }
  }

  for (const key in newObj) {
    if (!originalObj.hasOwnProperty(key)) {
      differences[key] = newObj[key]; // Agregar claves nuevas
    }
  }

  return differences;
};
