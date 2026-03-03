import { useRequestWithCache } from '.';
import { Brand } from '../../entities/brand';
import { Result } from './result';

export const useBrandList = (): Result<Array<Brand>> => {
  return useRequestWithCache<Array<Brand>>('/api/brands');
};
