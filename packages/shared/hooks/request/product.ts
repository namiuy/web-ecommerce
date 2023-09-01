import { useContext, useEffect } from 'react';
import { useRequest } from '.';
import { AppContext } from '../../context';
import { ProductSearch, ProductSearchSortBy } from '../../entities/product-search';
import { addSearchParamsToUrl } from '../../utils/url';
import { bff } from '../../env';
import { Result } from './result';
import { Product } from '../../entities/product';
import { del, post, put } from '../../utils/fetcher';

type ProductSearchProps = {
  brandId?: number;
  categoryId?: string;
  text?: string;
  sortBy?: ProductSearchSortBy;
};

export const productAdd = (data: any): Promise<Product> =>
  post<Product>(`${bff.url}/products`, { body: JSON.stringify(data) });

export const productUpdate = (id: string, data: any): Promise<Product> =>
  put<Product>(`${bff.url}/products/${id}`, { body: JSON.stringify(data) });

export const productDelete = (id: string): Promise<Product> => del<Product>(`${bff.url}/products/${id}`);

export const useProductGet = (id: string): Result<Product> => useRequest(`${bff.url}/products/${id}`);

export const useProductSearch = ({ brandId, categoryId, text, sortBy }: ProductSearchProps): Result<ProductSearch> => {
  const filters = {
    b: brandId?.toString(),
    c: categoryId?.toString(),
    t: text?.toString(),
  };

  const url = addSearchParamsToUrl(`${bff.url}/products/search`, {
    ...filters,
    sortBy,
  });

  const { isLoading, data, ...rest } = useRequest<ProductSearch>(url);

  const {
    setProductSearchResultIsLoading,
    setProductSearchResult,
    setProductSearchResultFilters,
    setProductSearchSortBy,
  } = useContext(AppContext);

  useEffect(() => {
    setProductSearchResultIsLoading(isLoading);

    if (!isLoading) {
      setProductSearchResult(data?.products);
      setProductSearchResultFilters(data?.filters);
    }
  }, [isLoading]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => setProductSearchSortBy(sortBy), [sortBy]); // eslint-disable-line react-hooks/exhaustive-deps

  return { isLoading, data, ...rest };
};
