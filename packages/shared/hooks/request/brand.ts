import useSWRImmutable from 'swr/immutable';
import { Brand } from '../../entities/brand';
import { fetcher } from './fetcher';
import { Response } from './response';

const useBrandList = (): Response<Array<Brand>> => {
  const { isLoading, error, data } = useSWRImmutable('http://localhost:3001/brand', fetcher);

  // if (cache) {
  //   return { isLoading: false, data: cache };
  // }

  // let dataMapped;

  // if (!isLoading && !error && data) {
  //   dataMapped = data.map(mapCategory);
  //   // const oneDay = 60 * 24;
  //   // setCache(dataMapped);
  // }

  return { isLoading, error, data };
};

export { useBrandList };
