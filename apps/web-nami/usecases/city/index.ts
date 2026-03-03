import { ICityRepository, City, Result } from '@namiuy/bff-core';

// Use case factory (functional approach)
export const createListCitiesUseCase = (repository: ICityRepository) => {
  return async (): Promise<Result<City[]>> => {
    return await repository.list();
  };
};

export type ListCitiesUseCase = ReturnType<typeof createListCitiesUseCase>;
