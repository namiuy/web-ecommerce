import { create } from 'zustand';

// Fecha de revelado del Modo Celeste = inauguración del Mundial 2026 (hora local).
// El countdown del banner y el gate de reveal usan ESTA misma constante para que
// "faltan 0 días" coincida con el momento exacto en que se enciende todo.
// MUNDIAL ACTIVADO: fecha adelantada al pasado para activar el modo celeste ya.
// Para revertir después del Mundial: restaurar a new Date('2026-06-11T19:00:00-03:00')
export const CELESTE_REVEAL_DATE = new Date('2026-06-01T00:00:00-03:00');

export const isCelesteRevealed = () => true;

type CelesteState = {
  enabled: boolean;
  hydrated: boolean;
  toggle: () => void;
  setEnabled: (value: boolean) => void;
  setHydrated: (value: boolean) => void;
};

export const useCelesteStore = create<CelesteState>(set => ({
  enabled: false,
  hydrated: false,
  toggle: () => set(state => ({ enabled: !state.enabled && isCelesteRevealed() })),
  setEnabled: (value: boolean) => set({ enabled: value && isCelesteRevealed() }),
  setHydrated: (value: boolean) => set({ hydrated: value }),
}));
