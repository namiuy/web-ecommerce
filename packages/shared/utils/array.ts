import { Brand } from '../entities/brand';
import { Category } from '../entities/category';
import { addSearchParamsToUrl, getProductsUrl } from './url';

type Option = {
  id: string;
  name: string;
  href: string;
  parent?: string;
};

export const getEmptyArray = <T>(length: number) => {
  let arr = [];
  for (let i = 0; i < length; i++) arr.push({} as T);
  return arr;
};

export const groupBy = <T>(arr: Array<T>, property: string): Record<string, Array<T>> => {
  return arr.reduce<Record<string, Array<T>>>((memo, x: any) => {
    if (!memo[x[property]]) {
      memo[x[property]] = [];
    }
    memo[x[property]].push(x);
    return memo;
  }, {});
};

export const sort = <T>(arr: Array<T>, property: string): Array<T> => {
  return arr.sort((a: any, b: any) => a[property] - b[property]);
};

export const mapCategoryOptions = (data: Category[], params: Record<string, any> = {}): Option[] => {
  return data
    .flatMap(c => (c?.sub_categories ? [c, ...c.sub_categories.map(sub => ({ ...sub, parent: c.name }))] : [c]))
    .map(({ id, ...rest }) => ({ ...rest, id, href: addSearchParamsToUrl(getProductsUrl(), { ...params, c: id }) }));
};

export const mapBrandOptions = (data: Brand[], params: Record<string, any> = {}): Option[] => {
  return data.map(({ id, name }) => ({
    id: id.toString(),
    name,
    href: addSearchParamsToUrl(getProductsUrl(), { ...params, b: id.toString() }),
  }));
};
