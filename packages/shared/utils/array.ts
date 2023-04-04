export const getEmptyArray = <T>(length: number) => {
  let arr = [];
  for (let i = 0; i < length; i++) arr.push({} as T);
  return arr;
};
