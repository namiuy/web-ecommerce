export const getObjectDifference = (originalObj: any, newObj: any): Record<string, any> => {
  const differences: Record<string, any> = {};

  for (const key in originalObj) {
    if (originalObj.hasOwnProperty(key)) {
      if (!newObj.hasOwnProperty(key)) {
        differences[key] = originalObj[key];
      } else if (originalObj[key] !== newObj[key]) {
        differences[key] = newObj[key];
      }
    }
  }

  for (const key in newObj) {
    if (newObj.hasOwnProperty(key) && !originalObj.hasOwnProperty(key)) {
      differences[key] = newObj[key];
    }
  }

  return differences;
};
