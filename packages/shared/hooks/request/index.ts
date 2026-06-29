import { useEffect, useState } from 'react';
import useSWRImmutable from 'swr/immutable';
import lscache from 'lscache';
import { Result } from './result';
import { isBrowser } from '../../utils';
import { get } from '../../utils/fetcher';

const oneDay = 60 * 24;

export const useRequest = <T>(url: string | null, withAuth?: boolean): Result<T> => {
  return useSWRImmutable<T>(url, url ? () => get<T>(url, {}, withAuth) : null);
};

const isValidResponse = <T>(data: T, error: any): boolean => {
  if (error) return false;

  if (data == null) return false;

  if (typeof data === 'object' && data !== null) {
    const errorResponse = data as any;

    if (
      errorResponse.error ||
      errorResponse.message ||
      errorResponse.status === 'error' ||
      errorResponse.success === false
    ) {
      return false;
    }
  }

  return true;
};

export const useRequestWithCache = <T>(url: string | null, cacheTime: number = oneDay): Result<T> => {
  const windowState = isBrowser();
  const [cache, setCache] = useState<T>();
  const [isWindowReady, setIsWindowReady] = useState(false);

  useEffect(() => {
    if (!url) return;
    const item = lscache.get(url);
    if (item) setCache(item);
  }, [url]);

  useEffect(() => setIsWindowReady(windowState), [windowState]);

  const { isLoading, error, data } = useSWRImmutable<T>(
    () => (isWindowReady && !cache && url ? url : null),
    () => url ? get<T>(url) : null as any,
  );

  useEffect(() => {
    if (!url || !isLoading && isValidResponse(data, error)) {
      if (url) lscache.set(url, data, cacheTime);
    }
  }, [isLoading, data, error, url, cacheTime]);

  return {
    isLoading: isLoading || !isWindowReady,
    error,
    data: cache ?? data,
  };
};
