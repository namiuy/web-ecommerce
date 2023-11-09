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
  dark?: boolean;
  logo?: ElementType;
  fontWeight?: number;
  menuItems?: Array<MenuItem>;
  fixed?: boolean;
  simple?: boolean;
};

export const NavBar = (props: NavBarProps) => {
  const isLg = useBreakpointValue({
    base: false,
    lg: true,
  });
  const { fixed } = props;
  const NavBarDisplay = isLg ? NavBarDesktop : NavBarMobile;

  return (
    <>
      <Box w="100%" zIndex="999" position={fixed ? 'fixed' : 'static'}>
        <NavBarDisplay {...props} menuItems={menuItems} />
      </Box>
      {fixed && <Box h="5.5rem" bg="black" />}
    </>
  );
};
