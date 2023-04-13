import { useRequestWithCache } from '.';
import { Brand } from '../../entities/brand';
import { Response } from './response';

export const useBrandList = (): Response<Array<Brand>> => useRequestWithCache('http://localhost:3001/brand');
