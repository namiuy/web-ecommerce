import { useContext, useEffect } from 'react';
import { useRequest } from '.';
import { AppContext } from '../../context';
import { ProductSearch } from '../../entities/product-search';
import { addSearchParamsToUrl } from '../../utils/url';
import { Response } from './response';

type ProductSearchProps = {
  brandId?: number;
  categoryId?: string;
  text?: string;
};

export const useProductGet = (id: number): Response<ProductSearch> => useRequest(`http://localhost:3001/product/${id}`);

export const useProductSearch = ({ brandId, categoryId, text }: ProductSearchProps): Response<ProductSearch> => {
  const filters = {
    b: brandId?.toString(),
    c: categoryId?.toString(),
    t: text?.toString(),
  };
  const url = addSearchParamsToUrl('http://localhost:3001/product/search', filters);
  const { isLoading, data, ...rest } = useRequest<ProductSearch>(url);

  const { setProductSearchFilters } = useContext(AppContext);

  useEffect(() => {
    if (!isLoading) setProductSearchFilters(data?.filters);
  }, [data?.filters]); // eslint-disable-line react-hooks/exhaustive-deps

  return { isLoading, data, ...rest };
};
