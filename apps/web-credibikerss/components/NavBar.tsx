import { useRef } from 'react';
import { AnimationWrapper, NavBar as NavBarUI } from 'ui';
import { LogoCeleste } from './celeste/LogoCeleste';
import { BannerStrip } from './celeste/BannerStrip';
import { useCelesteStore } from 'shared';
import { fire } from './celeste/Confetti';

const useLogoClickStreak = () => {
  const setEnabled = useCelesteStore(s => s.setEnabled);
  const enabled = useCelesteStore(s => s.enabled);
  const times = useRef<number[]>([]);

  return () => {
    const now = Date.now();
    times.current = [...times.current, now].filter(t => now - t < 1000);
    if (times.current.length >= 4) {
      times.current = [];
      if (!enabled) setEnabled(true);
      fire();
    }
  };
};

const AnimatedLogo = () => {
  const onLogoClick = useLogoClickStreak();
  return (
    <span onClick={onLogoClick} style={{ display: 'inline-block', cursor: 'pointer' }}>
      <AnimationWrapper tag="svg">
        <LogoCeleste />
      </AnimationWrapper>
    </span>
  );
};

export const NavBar = () => (
  <>
    <BannerStrip />
    <NavBarUI dark logo={AnimatedLogo} sticky hover simple spacer={false} />
  </>
);
