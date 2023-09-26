import { useRequest, useRequestWithCache } from '.';
import { Banner } from '../../entities/banner';
import { bff } from '../../env';
import { Result } from './result';

export const useBannerList = (): Result<Array<Banner>> => useRequestWithCache(`${bff.url}/banners`);

export const useBannerListWithoutCache = (): Result<Array<Banner>> => useRequest(`${bff.url}/banners`);
