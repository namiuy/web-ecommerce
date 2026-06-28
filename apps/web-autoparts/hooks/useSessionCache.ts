import { useCallback, useEffect } from 'react';

/**
 * Custom hook for managing sessionStorage caching of data
 * Automatically saves and retrieves data with a given cache key
 */
export function useSessionCache<T>(cacheKey: string, data: T | undefined, enabled: boolean = true) {
  // Save data to sessionStorage when it changes
  useEffect(() => {
    if (!enabled || !data || !cacheKey) return;

    try {
      sessionStorage.setItem(cacheKey, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save to sessionStorage:', error);
    }
  }, [cacheKey, data, enabled]);

  // Retrieve data from sessionStorage
  const getCachedData = useCallback((): T | null => {
    if (!enabled || !cacheKey) return null;

    try {
      const cached = sessionStorage.getItem(cacheKey);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.warn('Failed to retrieve from sessionStorage:', error);
      return null;
    }
  }, [cacheKey, enabled]);

  // Clear cache for this key
  const clearCache = useCallback(() => {
    if (!cacheKey) return;

    try {
      sessionStorage.removeItem(cacheKey);
    } catch (error) {
      console.warn('Failed to clear sessionStorage:', error);
    }
  }, [cacheKey]);

  return { getCachedData, clearCache };
}

/**
 * Helper to generate consistent cache keys for brands and models
 * Uses category ID instead of name to avoid inconsistencies
 */
export const generateCacheKey = {
  brands: (categoryId: string) => `brands-${categoryId}`,
  models: (categoryId: string, brandName: string) => `models-${categoryId}-${brandName}`,
};
