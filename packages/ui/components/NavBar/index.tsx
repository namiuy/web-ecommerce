import { Box, useBreakpointValue } from '@chakra-ui/react';
import { ElementType, ReactNode } from 'react';
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
  sticky?: boolean;
  simple?: boolean;
  hover?: boolean;
  extraActions?: ReactNode;
  spacer?: boolean;
  disableCategoriesPopover?: boolean;
};

export const NavBar = (props: NavBarProps) => {
  const isLg = useBreakpointValue({
    base: false,
    lg: true,
  });

  const { fixed, sticky, simple, spacer } = props;

  const NavBarDesktop = simple ? NavBarDesktopSimple : NavBarDesktopFull;

  const NavBarDisplay = isLg ? NavBarDesktop : NavBarMobile;

  const position = sticky ? 'sticky' : fixed ? 'fixed' : 'static';
  const showSpacer = spacer ?? (simple && !sticky);
  const needsTop = sticky || fixed;

  return (
    <>
      <Box w="100%" zIndex="9999" position={position} {...(needsTop ? { top: '0' } : {})}>
        <NavBarDisplay {...props} multiDomainItems={getMultiDomainItems()} menuItems={getMenuItems()} />
      </Box>
      {showSpacer && <Box h="6rem" bg="black" />}
    </>
  );
};
