import { ICategoryRepository, Category, Result, createSuccessResult, createErrorResult, createUnhandledError } from '@namiuy/bff-core';

// FastAPI response type
type FastAPICategory = {
  CategoryId: string;
  CategoryName: string;
  CategoryDescription?: string;
  CategoryType?: string;
};

// FastAPI response envelope
type FastAPIResponse<T> = {
  success: boolean;
  count: number;
  data: T;
};

// Mapper function (pure)
const mapCategory = (data: FastAPICategory): Category => ({
  id: data.CategoryId,
  name: data.CategoryName?.trim() || '',
  image_url: '',
});

// Repository factory (functional approach)
export const createCategoryRepositoryFastAPI = (apiBaseUrl: string): ICategoryRepository => {
  const categoryListUrl = `${apiBaseUrl}/categories`;

  return {
    list: async (): Promise<Result<Array<Category>>> => {
      try {
        const response = await fetch(categoryListUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          return createErrorResult(createUnhandledError(errorText));
        }

        const apiResponse = (await response.json()) as FastAPIResponse<Array<FastAPICategory>>;
        const categories = apiResponse.data
          .map(mapCategory)
          .filter(c => c.id !== '-1')
          .sort((a, b) => a.name.localeCompare(b.name));

        return createSuccessResult(categories);
      } catch (error) {
        return createErrorResult(createUnhandledError((error as Error).message));
      }
    },
  };
};
