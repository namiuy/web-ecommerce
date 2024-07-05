import { useEffect, useState } from 'react';
import useSWRImmutable from 'swr/immutable';
import lscache from 'lscache';
import { Result } from './result';
import { isBrowser } from '../../utils';
import { get } from '../../utils/fetcher';

const oneDay = 60 * 24;

export const useRequest = <T>(url: string, withAuth?: boolean): Result<T> => {
  return useSWRImmutable<T>(url, () => get<T>(url, {}, withAuth));
};

export const useRequestWithCache = <T>(url: string, cacheTime: number = oneDay): Result<T> => {
  const windowState = isBrowser();
  const [cache, setCache] = useState();
  const [isWindowReady, setIsWindowReady] = useState(false);

  useEffect(() => {
    const item = lscache.get(url);
    if (item) setCache(item);
  }, []);

  useEffect(() => setIsWindowReady(windowState), [windowState]);

  const { isLoading, error, data } = useSWRImmutable(() => (isWindowReady && !cache ? url : null), get<T>);

  if (!isLoading && !error && data) {
    lscache.set(url, data, cacheTime);
  }

  return { isLoading: isLoading || !isWindowReady, error, data: cache ?? data };
};
