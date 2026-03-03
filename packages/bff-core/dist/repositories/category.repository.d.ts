import { Result } from '../types';
import { Category } from '../entities';
export type ICategoryRepository = {
    list: () => Promise<Result<Array<Category>>>;
};
//# sourceMappingURL=category.repository.d.ts.map