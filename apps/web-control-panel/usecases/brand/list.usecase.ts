import { IBrandRepository, Brand, Result, isError } from '@namiuy/bff-core';

// Use case factory (functional approach)
export const createListBrandsUseCase = (repository: IBrandRepository) => {
  return async (): Promise<Result<Brand[]>> => {
    const result = await repository.list();

    if (isError(result)) {
      return result;
    }

    // No additional hydration needed for brands in this simple version
    // All hydration is already done in the repository
    return result;
  };
};

// Type for the use case
export type ListBrandsUseCase = ReturnType<typeof createListBrandsUseCase>;
