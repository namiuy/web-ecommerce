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

const NavBarDesktop = ({ dark, logo: Logo, multiDomainItems = [], menuItems = [], simple }: NavBarProps) => {
  const menuItemsWithOnClick = menuItems.map(i => (i.id === 'products' ? { ...i, menuContent: CategoriesWrapper } : i));

  return (
    <>
      {multiDomainItems.length != 0 && (
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
      <Box bg={_backgroundColorSecondary} backdropFilter={simple ? _backdropFilter : 'none'}>
        <Grid
          p={simple ? '1.5rem 0 1.5rem 0 ' : '1rem 0 0.375rem 0'}
          gridTemplateColumns={simple ? '12rem 1fr auto auto auto' : '12rem 1fr auto auto'}
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
          {simple && (
            <GridItem>
              <Nav items={menuItemsWithOnClick} />
            </GridItem>
          )}
          <GridItem>
            <SocialNetworks dark={dark} color={_navItemColor} size="1.2rem" hide={['tiktok', 'whatsapp']} />
          </GridItem>
          <GridItem>
            <MenuAdmin />
          </GridItem>
        </Grid>

        {!simple && (
          <Grid
            py="0.625rem"
            pl="1rem"
            bg={_backgroundColorSecondary}
            borderBottomColor={_borderColor}
            w={_mainWidth}
            m="0 auto"
            gridTemplateColumns={'1fr auto'}
          >
            <GridItem>
              <Nav items={menuItemsWithOnClick} />
            </GridItem>
            <GridItem>
              <Text color="white" fontWeight="semibold" fontSize="0.875rem">
                Lideres en radiadores y aire acondicionado
              </Text>
            </GridItem>
          </Grid>
        )}
      </Box>
    </>
  );
};

export default NavBarDesktop;
