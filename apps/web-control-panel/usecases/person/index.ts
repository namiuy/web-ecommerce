import { IPersonRepository, Person, PersonUpdate, Result } from '@namiuy/bff-core';

// Use case factories (functional approach)
export const createGetPersonUseCase = (repository: IPersonRepository) => {
  return async (id: string): Promise<Result<Person>> => {
    return await repository.get(id);
  };
};

export const createUpdatePersonUseCase = (repository: IPersonRepository) => {
  return async (person: PersonUpdate): Promise<Result<boolean>> => {
    return await repository.update(person);
  };
};

export type GetPersonUseCase = ReturnType<typeof createGetPersonUseCase>;
export type UpdatePersonUseCase = ReturnType<typeof createUpdatePersonUseCase>;
