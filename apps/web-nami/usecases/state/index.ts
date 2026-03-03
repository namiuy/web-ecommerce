import { IStateRepository, State, Result } from '@namiuy/bff-core';

// Use case factory (functional approach)
export const createListStatesUseCase = (repository: IStateRepository) => {
  return async (): Promise<Result<State[]>> => {
    return await repository.list();
  };
};

export type ListStatesUseCase = ReturnType<typeof createListStatesUseCase>;
