import { useRequestWithCache } from '.';
import { ProductList } from '../../entities/product-list';
import { Result } from './result';

const oneHour = 60 * 1;
const sixHours = 60 * 6;

export const useProductListGet = (id: number): Result<ProductList> =>
  useRequestWithCache(`/api/product-lists/${id}`, oneHour);

export const useProductListList = (): Result<Array<ProductList>> =>
  useRequestWithCache('/api/product-lists', sixHours);
