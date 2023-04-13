import { useRequestWithCache } from '.';
import { ProductList } from '../../entities/product-list';
import { Response } from './response';

const oneHour = 60 * 1;
const sixHours = 60 * 6;

export const useProductListGet = (id: number): Response<ProductList> =>
  useRequestWithCache(`http://localhost:3001/product-list/${id}`, oneHour);

export const useProductListList = (): Response<Array<ProductList>> =>
  useRequestWithCache('http://localhost:3001/product-list', sixHours);
