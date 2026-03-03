import {
  IBannerRepository,
  Banner,
  Result,
  createSuccessResult,
  createErrorResult,
  createUnhandledError,
} from '@namiuy/bff-core';

// FastAPI types
type FastAPIBanner = {
  id: number;
  section: string;
  indx: number;
  name: string;
  color: string;
  url: string;
  url_mobile: string;
  link?: string | null;
};

type FastAPIResponse<T> = {
  success: boolean;
  count: number;
  data: T;
};

// Mapper function (pure)
const mapBanner = (data: FastAPIBanner): Banner => ({
  section: data.section,
  indx: data.indx,
  name: data.name,
  color: data.color,
  url: data.url,
  url_mobile: data.url_mobile,
  link: data.link || '',
});

// Repository factory (functional approach)
export const createBannerRepositoryFastAPI = (apiBaseUrl: string): IBannerRepository => {
  return {
    list: async (): Promise<Result<Array<Banner>>> => {
      try {
        const response = await fetch(`${apiBaseUrl}/banners`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          return createErrorResult(createUnhandledError(errorText));
        }

        const apiResponse = (await response.json()) as FastAPIResponse<Array<FastAPIBanner>>;
        const banners = apiResponse.data.map(mapBanner);

        return createSuccessResult(banners);
      } catch (error) {
        return createErrorResult(createUnhandledError((error as Error).message));
      }
    },
  };
};
