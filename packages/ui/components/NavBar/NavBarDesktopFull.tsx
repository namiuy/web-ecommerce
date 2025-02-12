import { Box, Grid, GridItem, Container, Text, Flex } from '@chakra-ui/react';
import { NavBarProps } from '.';
import Nav from '../Nav';
import SearchInput from '../SearchInput';
import Link from 'next/link';
import { CategoriesPopover } from '../CategoriesPopover';
import SocialNetworks from '../SocialNetworks';
import NavMultiDomain from '../NavMultiDomain';
import MenuAdmin from '../MenuAdmin';
import { ShoppingCartDrawer } from '../ShoppingCartDrawer';
import { useEffect, useState } from 'react';
import { isBrowser, authEnabled } from 'shared';
import { User } from 'shared/entities/user';
import lscache from 'lscache';

const _navItemColor = 'brand.nav.item.color';
const _backgroundColorPrimary = 'brand.navBar.backgroundColorPrimary';
const _backgroundColorSecondary = 'brand.navBar.backgroundColorSecondary';
const _borderColor = 'brand.navBar.borderColor';
const _mainWidth = { base: '100%', lg: '80%' };

const CategoriesWrapper = () => (
  <Container px="0">
    <CategoriesPopover />
  </Container>
);

const NavBarDesktopFull = ({ dark, logo: Logo, multiDomainItems = [], menuItems = [] }: NavBarProps) => {
  const menuItemsWithOnClick = menuItems.map(i => (i.id === 'products' ? { ...i, menuContent: CategoriesWrapper } : i));

  const issBrowser = isBrowser();
  const [user, setUser] = useState<User>();

  useEffect(() => {
    if (issBrowser) setUser(lscache.get('user')); // TODO: improve this
  }, [issBrowser]);

  return (
    <>
      {multiDomainItems?.length > 0 && (
        <Box bg={_backgroundColorPrimary}>
          <Flex
            py="0.25rem"
            pl="1rem"
            borderBottom="solid 1px"
            justifyContent="space-between"
            alignItems="center"
            bg={_backgroundColorPrimary}
            borderBottomColor={_borderColor}
            w={_mainWidth}
            m="0 auto"
          >
            <NavMultiDomain items={multiDomainItems} />
            <SocialNetworks dark={dark} color={_navItemColor} size="1.2rem" hide={['tiktok', 'whatsapp']} />
          </Flex>
        </Box>
      )}
      <Box bg={_backgroundColorSecondary}>
        <Grid
          p="1.5rem 0 0.5rem 0"
          gridTemplateColumns={user ? '12rem 3fr auto auto auto' : '12rem 3fr auto auto'}
          alignItems="center"
          gap="1rem"
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
          {multiDomainItems?.length <= 0 && (
            <GridItem>
              <SocialNetworks dark={dark} color={_navItemColor} size="1.2rem" hide={['tiktok', 'whatsapp']} />
            </GridItem>
          )}
          {authEnabled && (
            <GridItem pl="1rem">
              <MenuAdmin />
            </GridItem>
          )}
          {user && (
            <GridItem>
              <ShoppingCartDrawer />
            </GridItem>
          )}
        </Grid>
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
      </Box>
    </>
  );
};

export default NavBarDesktopFull;
