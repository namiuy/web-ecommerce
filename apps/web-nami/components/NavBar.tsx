import { NavBar as NavBarUI } from 'ui';
import { Logo } from './LogoWhite';

const menuItems = [
  {
    id: 'index',
    text: 'Inicio',
    href: '/',
  },
  {
    id: 'products',
    text: 'Productos',
    href: '/productos',
  },
  {
    id: 'services',
    text: 'Servicios',
    href: '/servicios',
  },
  {
    id: 'company',
    text: 'Empresa',
    href: '/empresa',
  },
];

const socialNeworksItems = [
  {
    id: 'facebook',
    href: '/',
  },
  {
    id: 'instagram',
    href: '/',
  },
  {
    id: 'tiktok',
    href: '/',
  },
  {
    id: 'whatsapp',
    href: '/',
  },
];

export const NavBar = () => <NavBarUI logo={Logo} menuItems={menuItems} socialNeworksItems={socialNeworksItems} />;
