import { useRequest, useRequestWithCache } from '.';
import { City } from '../../entities/city';
import { bff } from '../../env';
import { Response } from './response';

const sevenDays = 1000 * 60 * 60 * 24 * 7;

export const useCityList = (): Response<Array<City>> => useRequestWithCache(`${bff.url}/cities`, sevenDays);

export const useCityListWithoutCache = (): Response<Array<City>> => useRequest(`${bff.url}/cities`);