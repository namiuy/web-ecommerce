import { useRequestWithCache } from '.';
import { Banner } from '../../entities/banner';
import { Result } from './result';

const sixHours = 60 * 6;

export const useBannerList = (): Result<Array<Banner>> => useRequestWithCache('/api/banners?v=2', sixHours);
