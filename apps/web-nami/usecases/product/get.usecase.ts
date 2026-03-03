import { IProductRepository, Product, Result } from '@namiuy/bff-core';

// Use case factory (functional approach)
export const createGetProductUseCase = (repository: IProductRepository) => {
  return async (id: string): Promise<Result<Product>> => {
    return await repository.get(id);
  };
};

export type GetProductUseCase = ReturnType<typeof createGetProductUseCase>;
