import { IBrandRepository, Brand, Result, createSuccessResult, createErrorResult, createUnhandledError } from '@namiuy/bff-core';

// FastAPI response type
type FastAPIBrand = {
  BrandId: number;
  BrandName: string;
  ProviderId?: number;
};

// FastAPI response envelope
type FastAPIResponse<T> = {
  success: boolean;
  count: number;
  data: T;
};

// Mapper function (pure)
const mapBrand = (brandsUrl: string) => (data: FastAPIBrand): Brand => {
  const brandName = data.BrandName?.trim() || '';
  return {
    id: data.BrandId,
    name: brandName,
    logo_url: `${brandsUrl}/${encodeURIComponent(brandName)}.jpg`,
  };
};

// Repository factory (functional approach)
export const createBrandRepositoryFastAPI = (
  apiBaseUrl: string,
  brandsUrl: string
): IBrandRepository => {
  const brandListUrl = `${apiBaseUrl}/brands`;
  const mapper = mapBrand(brandsUrl);

  return {
    list: async (): Promise<Result<Array<Brand>>> => {
      try {
        const response = await fetch(brandListUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          return createErrorResult(createUnhandledError(errorText));
        }

        const apiResponse = (await response.json()) as FastAPIResponse<Array<FastAPIBrand>>;
        const brands = apiResponse.data
          .map(mapper)
          .sort((a, b) => a.name.localeCompare(b.name));

        return createSuccessResult(brands);
      } catch (error) {
        return createErrorResult(createUnhandledError((error as Error).message));
      }
    },
  };
};
