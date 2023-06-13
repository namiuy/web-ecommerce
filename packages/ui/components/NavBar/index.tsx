import { Box, useBreakpointValue } from '@chakra-ui/react';
import { ElementType } from 'react';
import { menuItems } from 'shared/env';
import NavBarDesktop from './NavBarDesktop';
import NavBarMobile from './NavBarMobile';

export type MenuItem = {
  id: string;
  text: string;
  href: string;
};

export type NavBarProps = {
  logo?: ElementType;
  fontWeight?: number;
  menuItems?: Array<MenuItem>;
};

export const NavBar = (props: NavBarProps) => {
  const isLg = useBreakpointValue({
    base: false,
    lg: true,
  });
  const NavBarDisplay = isLg ? NavBarDesktop : NavBarMobile;
  return (
    <Box position="fixed" top="0" w="100%" zIndex="999">
      <NavBarDisplay {...props} menuItems={menuItems} />
    </Box>
  );
};
