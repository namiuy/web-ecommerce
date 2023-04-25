import { useRequestWithCache } from '.';
import { ProductList } from '../../entities/product-list';
import { bff } from '../../env';
import { Response } from './response';

const oneHour = 60 * 1;
const sixHours = 60 * 6;

export const useProductListGet = (id: number): Response<ProductList> =>
  useRequestWithCache(`${bff.url}/product-list/${id}`, oneHour);

export const useProductListList = (): Response<Array<ProductList>> =>
  useRequestWithCache(`${bff.url}/product-list`, sixHours);
