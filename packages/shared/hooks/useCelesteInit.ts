import { useEffect } from 'react';
import { CELESTE_REVEAL_DATE, useCelesteStore } from '../store/celeste';

// setTimeout usa un delay de 32 bits con signo: si pasa ~24.8 días, hace overflow
// y se dispara al instante. Solo programamos el timer si el delay entra en ese rango.
const MAX_TIMEOUT_MS = 2147483647;

export const useCelesteInit = () => {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const { setHydrated, setEnabled } = useCelesteStore.getState();

    // Hidratar de inmediato -> el banner con countdown aparece apenas carga (sin delay).
    setHydrated(true);

    const reveal = CELESTE_REVEAL_DATE.getTime();
    const delay = reveal - Date.now();

    if (delay <= 0) {
      // Ya pasó la fecha de inauguración -> revelar todo el Modo Celeste.
      setEnabled(true);
      return;
    }

    // Pre-reveal: solo el banner queda visible. Si falta poco (cabe en el límite de
    // setTimeout), programamos el encendido exacto para que una pestaña abierta
    // cruzando el momento del reveal se encienda sola sin recargar.
    if (delay <= MAX_TIMEOUT_MS) {
      const timer = window.setTimeout(() => {
        useCelesteStore.getState().setEnabled(true);
      }, delay);
      return () => window.clearTimeout(timer);
    }
  }, []);
};
