import { ReactNode, useEffect } from 'react';
import { useCelesteInit, useCelesteStore } from 'shared';
import { CursorFlag } from './CursorFlag';

type Props = { children: ReactNode };

export const CelesteProvider = ({ children }: Props) => {
  useCelesteInit();
  const enabled = useCelesteStore(s => s.enabled);
  const hydrated = useCelesteStore(s => s.hydrated);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (enabled && hydrated) {
      document.body.classList.add('celeste-on');
    } else {
      document.body.classList.remove('celeste-on');
    }
  }, [enabled, hydrated]);

  return (
    <>
      {children}
      <CursorFlag />
    </>
  );
};
