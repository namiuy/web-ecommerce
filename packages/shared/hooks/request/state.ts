import { useRequest, useRequestWithCache } from '.';
import { State } from '../../entities/state';
import { bff } from '../../env';
import { Response } from './response';

const sevenDays = 1000 * 60 * 60 * 24 * 7;

export const useStateList = (): Response<Array<State>> => useRequestWithCache(`${bff.url}/states`, sevenDays);

export const useStateListWithoutCache = (): Response<Array<State>> => useRequest(`${bff.url}/states`);