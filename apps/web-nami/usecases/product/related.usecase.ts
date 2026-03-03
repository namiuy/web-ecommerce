import { IProductRepository, ProductRelated, Result } from '@namiuy/bff-core';

// Use case factory (functional approach)
export const createGetRelatedProductsUseCase = (repository: IProductRepository) => {
  return async (id: string): Promise<Result<ProductRelated>> => {
    return await repository.related(id);
  };
};

export type GetRelatedProductsUseCase = ReturnType<typeof createGetRelatedProductsUseCase>;
