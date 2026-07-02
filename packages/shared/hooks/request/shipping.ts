import { useState, useEffect } from 'react';
import { ShippingMethod } from '../../entities/shipping-method';
import { getShippingMethods } from '../../env';

export const useShippingMethods = (): ShippingMethod[] => {
  const configMethods = getShippingMethods() || [];
  const [methods, setMethods] = useState<ShippingMethod[]>(configMethods);

  useEffect(() => {
    fetch('/api/shipping')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setMethods(data);
        }
      })
      .catch(() => {
        // Fallback to config values
      });
  }, []);

  return methods;
};
