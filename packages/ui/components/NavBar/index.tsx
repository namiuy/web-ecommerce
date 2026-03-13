import { Box, useBreakpointValue } from '@chakra-ui/react';
import { ElementType } from 'react';
import { getMultiDomainItems, getMenuItems } from 'shared/env';
import NavBarDesktopFull from './NavBarDesktopFull';
import NavBarMobile from './NavBarMobile';
import NavBarDesktopSimple from './NavBarDesktopSimple';

export type MultiDomainItem = {
  id: string;
  text: string;
  href: string;
};

export type MenuItem = {
  id: string;
  text: string;
  href: string;
};

export type NavBarProps = {
  dark?: boolean;
  logo?: ElementType;
  fontWeight?: number;
  multiDomainItems?: Array<MultiDomainItem>;
  menuItems?: Array<MenuItem>;
  fixed?: boolean;
  simple?: boolean;
  hover?: boolean;
};

export const NavBar = (props: NavBarProps) => {
  const isLg = useBreakpointValue({
    base: false,
    lg: true,
  });

  const { fixed, simple } = props;
  const multiDomainItems = getMultiDomainItems();
  const menuItems = getMenuItems();

  const NavBarDesktop = simple ? NavBarDesktopSimple : NavBarDesktopFull;

  const NavBarDisplay = isLg ? NavBarDesktop : NavBarMobile;

  return (
    <>
      <Box w="100%" zIndex="999" position={fixed ? 'fixed' : 'static'}>
        <NavBarDisplay {...props} multiDomainItems={multiDomainItems} menuItems={menuItems} />
      </Box>
      {simple && <Box h="6rem" bg="black" />}
    </>
  );
};
