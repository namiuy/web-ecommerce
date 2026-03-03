import { Result } from '../types';
import { City } from '../entities';
export type ICityRepository = {
    list: () => Promise<Result<City[]>>;
};
//# sourceMappingURL=city.repository.d.ts.map