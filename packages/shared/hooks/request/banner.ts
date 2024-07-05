import { useRequestWithCache } from '.';
import { Banner } from '../../entities/banner';
import { bff } from '../../env';
import { Result } from './result';

const sixHours = 60 * 6;

export const useBannerList = (): Result<Array<Banner>> => useRequestWithCache(`${bff.url}/banners`, sixHours);
