import { IProductRepository, ProductSearch, SearchFilters, ProductSearchSortBy, Result } from '@namiuy/bff-core';

// Use case factory (functional approach)
export const createSearchProductsUseCase = (repository: IProductRepository) => {
  return async (filters: SearchFilters, sortBy: ProductSearchSortBy, index: number): Promise<Result<ProductSearch>> => {
    return await repository.search(filters, sortBy, index);
  };
};

export type SearchProductsUseCase = ReturnType<typeof createSearchProductsUseCase>;
