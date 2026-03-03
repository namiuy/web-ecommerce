import { useRequest, useRequestWithCache } from '.';
import { State } from '../../entities/state';
import { Result } from './result';

const sevenDays = 1000 * 60 * 60 * 24 * 7;

export const useStateList = (): Result<Array<State>> => useRequestWithCache('/api/states', sevenDays);

export const useStateListWithoutCache = (): Result<Array<State>> => useRequest('/api/states');
