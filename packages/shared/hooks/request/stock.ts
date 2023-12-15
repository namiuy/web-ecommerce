import { useRequest } from '.';
import { useContext, useEffect } from 'react';
import { AppContext } from '../../context';
import { ProductSearch, ProductSearchSortBy } from '../../entities/product-search';
import { addSearchParamsToUrl } from '../../utils/url';
import { bff } from '../../env';
import { Result } from './result';
import { Stock } from '../../entities/stock';

export const useStockGet = (id: string): Result<Stock> => useRequest(`${bff.url}/stocks/${id}`);
