import { useRequestWithCache } from '.';
import { Brand } from '../../entities/brand';
import { bff } from '../../env';
import { Response } from './response';

export const useBrandList = (): Response<Array<Brand>> => {
  return useRequestWithCache<Array<Brand>>(`${bff.url}/brand`);
};
