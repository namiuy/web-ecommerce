import { Box, Grid, GridItem, Container, Text, Flex } from '@chakra-ui/react';
import { NavBarProps } from '.';
import Nav from '../Nav';
import SearchInput from '../SearchInput';
import Link from 'next/link';
import { CategoriesPopover } from '../CategoriesPopover';
import SocialNetworks from '../SocialNetworks';
import NavMultiDomain from '../NavMultiDomain';
import MenuAdmin from '../MenuAdmin';

const _navItemColor = 'brand.nav.item.color';
const _backgroundColorPrimary = 'brand.navBar.backgroundColorPrimary';
const _backgroundColorSecondary = 'brand.navBar.backgroundColorSecondary';
const _backdropFilter = 'saturate(180%) blur(20px)';
const _borderColor = 'brand.navBar.borderColor';
const _mainWidth = { base: '100%', lg: '80%' };

const CategoriesWrapper = () => (
  <Container px="0">
    <CategoriesPopover />
  </Container>
);

const NavBarDesktopSimple = ({ dark, logo: Logo, multiDomainItems = [], menuItems = [] }: NavBarProps) => {
  const menuItemsWithOnClick = menuItems.map(i => (i.id === 'products' ? { ...i, menuContent: CategoriesWrapper } : i));

  return (
    <>
      {multiDomainItems?.length > 0 && (
        <Box bg={_backgroundColorPrimary}>
          <Flex
            py="0.375rem"
            pl="1rem"
            borderBottom="solid 1px"
            justifyContent="center"
            alignItems="center"
            bg={_backgroundColorPrimary}
            borderBottomColor={_borderColor}
            w={_mainWidth}
            m="0 auto"
          >
            <NavMultiDomain items={multiDomainItems} />
          </Flex>
        </Box>
      )}
      <Box bg={_backgroundColorSecondary} backdropFilter={_backdropFilter}>
        <Grid
          p="1.5rem 0"
          gridTemplateColumns="12rem 1fr auto auto"
          alignItems="center"
          gap="2rem"
          w={_mainWidth}
          m="0 auto"
        >
          <GridItem justifySelf="center">
            {Logo && (
              <Link href="/">
                <Logo />
              </Link>
            )}
          </GridItem>
          <GridItem>
            <SearchInput />
          </GridItem>
          <GridItem>
            <Nav items={menuItemsWithOnClick} />
          </GridItem>
        </Grid>
      </Box>
    </>
  );
};

export default NavBarDesktopSimple;
