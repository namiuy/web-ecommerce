import { AnimationWrapper, NavBar as NavBarUI } from 'ui';
import { Logo } from './Logo';

const AnimatedLogo = () => (
  <AnimationWrapper tag="svg">
    <Logo />
  </AnimationWrapper>
);

export const NavBar = () => <NavBarUI dark logo={AnimatedLogo} fixed hover simple />;
