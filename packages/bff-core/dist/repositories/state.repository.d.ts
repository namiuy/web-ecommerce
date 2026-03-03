import { Result } from '../types';
import { State } from '../entities';
export type IStateRepository = {
    list: () => Promise<Result<State[]>>;
};
//# sourceMappingURL=state.repository.d.ts.map