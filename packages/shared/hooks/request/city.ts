import { useRequestWithCache } from '.';
import { City } from '../../entities/city';
import { Result } from './result';

const sevenDays = 1000 * 60 * 60 * 24 * 7;

export const useCityList = (): Result<Array<City>> => useRequestWithCache('/api/cities', sevenDays);
