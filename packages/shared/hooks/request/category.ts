import { useRequestWithCache } from '.';
import { Category } from '../../entities/category';
import { Result } from './result';

export const useCategoryList = (): Result<Array<Category>> => useRequestWithCache('/api/categories');
