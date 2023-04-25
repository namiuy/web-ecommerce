import { Box, useBreakpointValue } from '@chakra-ui/react';
import { ElementType } from 'react';
import NavBarDesktop from './NavBarDesktop';
import NavBarMobile from './NavBarMobile';

export type MenuItem = {
  id: string;
  text: string;
  href: string;
};

export type SocialNeworkItem = {
  id: string;
  href: string;
};

export type NavBarProps = {
  logo?: ElementType;
  fontWeight?: number;
  menuItems: Array<MenuItem>;
  socialNeworksItems: Array<SocialNeworkItem>;
};

export const NavBar = (props: NavBarProps) => {
  const isLg = useBreakpointValue({
    base: false,
    lg: true,
  });
  const NavBarDisplay = isLg ? NavBarDesktop : NavBarMobile;
  return (
    <Box position="sticky" top="0" w="100%" zIndex="999">
      <NavBarDisplay {...props} />
    </Box>
  );
};
