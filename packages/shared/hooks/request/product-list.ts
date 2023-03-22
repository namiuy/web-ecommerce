import useSWRImmutable from 'swr/immutable';
import { ProductList } from '../../entities/product-list';
import { fetcher } from './fetcher';
import { Response } from './response';

export const useProductListGet = (id: number): Response<ProductList> => {
  const { isLoading, error, data } = useSWRImmutable(`http://localhost:3001/product-list/${id}`, fetcher);

  // if (cache) {
  //   return { isLoading: false, data: cache };
  // }

  return { isLoading, error, data };
};

export const useProductListList = (): Response<Array<ProductList>> => {
  const { isLoading, error, data } = useSWRImmutable('http://localhost:3001/product-list', fetcher);

  // if (cache) {
  //   return { isLoading: false, data: cache };
  // }

  return { isLoading, error, data };
};
