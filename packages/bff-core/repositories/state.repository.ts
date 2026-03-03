import { Result } from '../types';
import { State } from '../entities';

export type IStateRepository = {
  list: () => Promise<Result<State[]>>;
};
