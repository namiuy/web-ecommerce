import { AnimationWrapper, NavBar as NavBarUI } from 'ui';
import { Logo } from './Logo';

export const NavBar = () => (
  <AnimationWrapper tag="a">
    <NavBarUI logo={Logo} />
  </AnimationWrapper>
);
