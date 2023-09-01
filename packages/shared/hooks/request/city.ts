import { useRequest, useRequestWithCache } from '.';
import { City } from '../../entities/city';
import { bff } from '../../env';
import { Result } from './result';

const sevenDays = 1000 * 60 * 60 * 24 * 7;

export const useCityList = (): Result<Array<City>> => useRequestWithCache(`${bff.url}/cities`, sevenDays);

export const useCityListWithoutCache = (): Result<Array<City>> => useRequest(`${bff.url}/cities`);
