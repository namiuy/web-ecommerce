import { useRequestWithCache } from '.';
import { Category } from '../../entities/category';
import { bff } from '../../env';
import { Result } from './result';

export const useCategoryList = (): Result<Array<Category>> => useRequestWithCache(`${bff.url}/categories`);
