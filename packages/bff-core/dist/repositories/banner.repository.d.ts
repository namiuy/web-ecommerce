import { Result } from '../types';
import { Banner } from '../entities';
export type IBannerRepository = {
    list: () => Promise<Result<Array<Banner>>>;
};
//# sourceMappingURL=banner.repository.d.ts.map