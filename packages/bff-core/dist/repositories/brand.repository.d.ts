import { Result } from '../types';
import { Brand } from '../entities';
export type IBrandRepository = {
    list: () => Promise<Result<Array<Brand>>>;
};
//# sourceMappingURL=brand.repository.d.ts.map