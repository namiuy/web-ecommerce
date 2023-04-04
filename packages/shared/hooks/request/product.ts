import useSWRImmutable from 'swr/immutable';
import { Product } from '../../entities/product';
import { fetcher } from './fetcher';
import { Response } from './response';

type ProductSearchProps = {
  brandId?: number;
  categoryId?: string;
  text?: string;
};

const addSearchParams = (url: string, params: Record<string, string | undefined>): URL => {
  const filters = Object.entries(params).filter((p): p is [string, string] => !!p[1]);
  return new URL(`${url}?${new URLSearchParams(filters)}`);
};

export const useProductGet = (id: number): Response<Product> => {
  const { isLoading, error, data } = useSWRImmutable(`http://localhost:3001/product/${id}`, fetcher);

  // if (cache) {
  //   return { isLoading: false, data: cache };
  // }

  return { isLoading, error, data };
};

export const useProductSearch = ({ brandId, categoryId, text }: ProductSearchProps): Response<Array<Product>> => {
  const filters = {
    b: brandId?.toString(),
    c: categoryId?.toString(),
    t: text?.toString(),
  };
  const url = addSearchParams('http://localhost:3001/product/search', filters);
  const { isLoading, error, data } = useSWRImmutable(url.href, fetcher);

  // if (cache) {
  //   return { isLoading: false, data: cache };
  // }

  return { isLoading, error, data };
};
