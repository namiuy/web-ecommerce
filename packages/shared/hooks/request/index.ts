import { useEffect, useState } from 'react';
import useSWRImmutable from 'swr/immutable';
import lscache from 'lscache';
import { fetcher } from '../../utils/fetcher';
import { Response } from './response';

const oneDay = 60 * 24;

export const useRequest = <T>(url: string): Response<T> => {
  return useSWRImmutable<T>(url, fetcher);
};

export const useRequestWithCache = <T>(url: string, cacheTime: number = oneDay): Response<T> => {
  const windowState = typeof window !== 'undefined';
  const [cache, setCache] = useState();
  const [isWindowReady, setIsWindowReady] = useState(false);

  useEffect(() => {
    const item = lscache.get(url);
    if (item) setCache(item);
  }, []);

  useEffect(() => setIsWindowReady(windowState), [windowState]);

  const { isLoading, error, data } = useSWRImmutable(() => (isWindowReady && !cache ? url : null), fetcher);

  if (!isLoading && !error && data) {
    lscache.set(url, data, cacheTime);
  }

  return { isLoading, error, data: cache ? cache : data };
};
