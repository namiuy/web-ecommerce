import { useRequest } from '.';
import { bff } from '../../env';
import { Result } from './result';
import { Stock } from '../../entities/stock';

export const useStockGet = (id: string): Result<Stock> => useRequest(`${bff.url}/stocks/${id}`, true);
