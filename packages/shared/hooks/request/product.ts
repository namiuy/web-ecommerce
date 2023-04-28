import { useContext, useEffect } from 'react';
import { useRequest } from '.';
import { AppContext } from '../../context';
import { ProductSearch, ProductSearchSortBy } from '../../entities/product-search';
import { addSearchParamsToUrl } from '../../utils/url';
import { bff } from '../../env';
import { Response } from './response';

type ProductSearchProps = {
  brandId?: number;
  categoryId?: string;
  text?: string;
  sortBy?: ProductSearchSortBy;
};

export const useProductGet = (id: number): Response<ProductSearch> => useRequest(`${bff.url}/product/${id}`);

export const useProductSearch = ({
  brandId,
  categoryId,
  text,
  sortBy,
}: ProductSearchProps): Response<ProductSearch> => {
  const filters = {
    b: brandId?.toString(),
    c: categoryId?.toString(),
    t: text?.toString(),
  };

  const url = addSearchParamsToUrl(`${bff.url}/product/search`, {
    ...filters,
    sortBy,
  });

  const { isLoading, data, ...rest } = useRequest<ProductSearch>(url);

  const { setProductSearchResultFilters, setProductSearchSortBy } = useContext(AppContext);

  useEffect(() => {
    if (!isLoading) setProductSearchResultFilters(data?.filters);
  }, [data?.filters]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => setProductSearchSortBy(sortBy), [sortBy]); // eslint-disable-line react-hooks/exhaustive-deps

  return { isLoading, data, ...rest };
};
