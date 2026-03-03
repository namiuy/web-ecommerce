import { useRequest } from '.';
import { Result } from './result';
import { Stock } from '../../entities/stock';

export const useStockGet = (id: string): Result<Stock> => useRequest(`/api/stocks/${id}`, true);
