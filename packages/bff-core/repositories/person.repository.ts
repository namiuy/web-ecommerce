import { Result } from '../types';
import { Person, PersonUpdate } from '../entities';

export type IPersonRepository = {
  get: (id: string) => Promise<Result<Person>>;
  update: (person: PersonUpdate) => Promise<Result<boolean>>;
};
