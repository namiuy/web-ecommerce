import { useRequestWithCache } from '.';
import { ProductList } from '../../entities/product-list';
import { bff } from '../../env';
import { Response } from './result';

const oneHour = 60 * 1;
const sixHours = 60 * 6;

export const useProductListGet = (id: number): Result<ProductList> =>
  useRequestWithCache(`${bff.url}/product-lists/${id}`, oneHour);

export const useProductListList = (): Result<Array<ProductList>> =>
  useRequestWithCache(`${bff.url}/product-lists`, sixHours);
