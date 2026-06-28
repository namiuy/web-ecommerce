import { useRequest, useRequestWithCache } from '.';
import { Autopart } from '../../entities/autopart';
import { Result } from './result';

const oneHour = 60;
const sixHours = 60 * 6;

export const useAutopartGet = (id: string): Result<Autopart> =>
  useRequest(`/api/products/${id}`, false);

export const useAutopartRelatedGet = (family: string): Result<{ autoparts: Autopart[] }> =>
  useRequest(family ? `/api/autoparts/search?family=${encodeURIComponent(family)}` : null, false);

export const useAutopartSearch = (params: {
  categoryName?: string;
  brandName?: string;
  modelName?: string;
}): Result<Autopart[]> => {
  const { categoryName, brandName, modelName } = params;
  const url = categoryName && brandName && modelName
    ? `/api/autoparts/search?productType=${encodeURIComponent(categoryName)}&brand=${encodeURIComponent(brandName)}&model=${encodeURIComponent(modelName)}`
    : null;
  return useRequest(url, false);
};

export const useBrandsByCategory = (categoryName: string): Result<string[]> =>
  useRequestWithCache(
    categoryName ? `/api/autoparts/brands?productType=${encodeURIComponent(categoryName)}` : null,
    sixHours,
  );

export const useModelsByBrandAndCategory = (categoryName: string, brandName: string): Result<string[]> =>
  useRequestWithCache(
    categoryName && brandName
      ? `/api/autoparts/models?productType=${encodeURIComponent(categoryName)}&brand=${encodeURIComponent(brandName)}`
      : null,
    oneHour,
  );
