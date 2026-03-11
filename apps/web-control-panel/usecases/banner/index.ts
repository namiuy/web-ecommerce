import { IBannerRepository, Banner, Result } from '@namiuy/bff-core';

// Use case factory (functional approach)
export const createListBannersUseCase = (repository: IBannerRepository) => {
  return async (): Promise<Result<Array<Banner>>> => {
    return await repository.list();
  };
};

export type ListBannersUseCase = ReturnType<typeof createListBannersUseCase>;
