import { useRequestWithCache } from '.';
import { Category } from '../../entities/category';
import { bff } from '../../env';
import { Response } from './response';

export const useCategoryList = (): Response<Array<Category>> => useRequestWithCache(`${bff.url}/categories`);
