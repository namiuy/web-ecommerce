import { NavBar as NavBarUI } from 'ui';
import { Logo } from './LogoTools';

type NavBarProps = {
  fixed?: boolean;
};

export const NavBar = ({ fixed }: NavBarProps) => <NavBarUI logo={Logo} fixed={fixed} />;
