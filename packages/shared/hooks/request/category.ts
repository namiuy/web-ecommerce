import { useRequestWithCache } from '.';
import { Category } from '../../entities/category';
import { Response } from './response';

export const useCategoryList = (): Response<Array<Category>> => useRequestWithCache('http://localhost:3001/category');
