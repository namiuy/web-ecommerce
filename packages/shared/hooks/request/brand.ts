import { useRequestWithCache } from '.';
import { Brand } from '../../entities/brand';
import { bff } from '../../env';
import { Response } from './response';

export const useBrandList = (): Response<Array<Brand>> => {
  console.log('bffUrl', bff, bff.url);
  return useRequestWithCache<Array<Brand>>(`${bff.url}/brand`);
};
