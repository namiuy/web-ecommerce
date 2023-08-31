import { useRequest, useRequestWithCache } from '.';
import { State } from '../../entities/state';
import { bff } from '../../env';
import { Response } from './result';

const sevenDays = 1000 * 60 * 60 * 24 * 7;

export const useStateList = (): Result<Array<State>> => useRequestWithCache(`${bff.url}/states`, sevenDays);

export const useStateListWithoutCache = (): Result<Array<State>> => useRequest(`${bff.url}/states`);
