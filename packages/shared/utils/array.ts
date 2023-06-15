export const getEmptyArray = <T>(length: number) => {
  let arr = [];
  for (let i = 0; i < length; i++) arr.push({} as T);
  return arr;
};

export const groupBy = <T>(arr: Array<T>, property: string): Record<string, Array<T>> => {
  return arr.reduce<Record<string, Array<T>>>((memo, x) => {
    if (!memo[x[property]]) {
      memo[x[property]] = [];
    }
    memo[x[property]].push(x);
    return memo;
  }, {});
};

export const sort = <T>(arr: Array<T>, property: string): Array<T> => {
  return arr.sort((a, b) => a[property] - b[property]);
};
