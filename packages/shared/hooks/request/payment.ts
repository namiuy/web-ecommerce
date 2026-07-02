import { useState, useEffect } from 'react';
import { PaymentMethod } from '../../entities/payment-method';
import { getPaymentMethods } from '../../env';

export const usePaymentMethods = (): PaymentMethod[] => {
  const configMethods = getPaymentMethods() || [];
  const enabledIds = configMethods.map(m => m.id);
  const [methods, setMethods] = useState<PaymentMethod[]>(configMethods);

  useEffect(() => {
    if (enabledIds.length === 0) return;
    fetch('/api/payments')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const filtered = data.filter((m: any) => enabledIds.includes(m.id));
          if (filtered.length > 0) {
            setMethods(filtered);
          }
        }
      })
      .catch(() => {
        // Fallback to config values
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return methods;
};
