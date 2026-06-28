import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';

/**
 * Custom hook for managing URL query parameters with shallow routing
 * Provides type-safe access to URL state and automatic synchronization
 */
export function useUrlState<T extends Record<string, string | undefined>>(
  initialParams: T
): [T, (updates: Partial<T>) => void, boolean] {
  const router = useRouter();
  const [params, setParams] = useState<T>(initialParams);
  const [isReady, setIsReady] = useState(false);

  // Initialize params from URL when router is ready
  useEffect(() => {
    if (!router.isReady) return;

    const urlParams = { ...initialParams };
    Object.keys(initialParams).forEach((key) => {
      const value = router.query[key];
      if (typeof value === 'string') {
        (urlParams as any)[key] = value;
      }
    });

    setParams(urlParams);
    setIsReady(true);
  }, [router.isReady]);

  // Update URL when params change (after initialization)
  const updateParams = useCallback(
    (updates: Partial<T>) => {
      if (!isReady) return;

      const newParams = { ...params, ...updates };
      setParams(newParams);

      // Build clean query object (remove undefined values and ensure all values are strings)
      const query: Record<string, string> = {};

      Object.keys({ ...router.query, ...newParams }).forEach((key) => {
        const value = newParams[key] !== undefined ? newParams[key] : router.query[key];
        if (typeof value === 'string' && value !== '') {
          query[key] = value;
        }
      });

      // Update URL without page reload
      router.replace({ pathname: router.pathname, query }, undefined, { shallow: true });
    },
    [router, params, isReady]
  );

  return [params, updateParams, isReady];
}
