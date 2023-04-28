import { useRequest, useRequestWithCache } from '.';
import { Banner } from '../../entities/banner';
import { bff } from '../../env';
import { Response } from './response';

export const useBannerList = (): Response<Array<Banner>> => useRequestWithCache(`${bff.url}/banner`);

export const useBannerListWithoutCache = (): Response<Array<Banner>> => useRequest(`${bff.url}/banner`);
