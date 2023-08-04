import { useRequestWithCache } from '.';
import { Brand } from '../../entities/brand';
import { bff } from '../../env';
import { Response } from './result';

export const useBrandList = (): Result<Array<Brand>> => {
  return useRequestWithCache<Array<Brand>>(`${bff.url}/brands`);
};
