import { useState, useEffect } from 'react';
import { PaymentMethod } from '../../entities/payment-method';
import { getPaymentMethods } from '../../env';

export const usePaymentMethods = (): PaymentMethod[] => {
  const configMethods = getPaymentMethods() || [];
  const [methods, setMethods] = useState<PaymentMethod[]>(configMethods);

  useEffect(() => {
    fetch('/api/payments')
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
