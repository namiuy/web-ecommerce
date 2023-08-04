import { useRequestWithCache } from '.';
import { Category } from '../../entities/category';
import { bff } from '../../env';
import { Response } from './result';

export const useCategoryList = (): Result<Array<Category>> => useRequestWithCache(`${bff.url}/categories`);
