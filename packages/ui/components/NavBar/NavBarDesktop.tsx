import lscache from 'lscache';
import { Grid, GridItem } from '@chakra-ui/react';
import { NavBarProps } from '.';
import Nav from '../Nav';
import SearchInput from '../SearchInput';
import SocialNeworks from '../SocialNeworks';
import Link from 'next/link';
import { CategoriesPopover } from '../CategoriesPopover';
import MenuAdmin from '../MenuAdmin';
import { User } from 'shared/entities/user';
import { isBrowser } from 'shared';
import { useEffect, useState } from 'react';
import { Container } from '../Container';

const _navItemColor = 'brand.nav.item.color';
const _backgroundColor = 'brand.navBar.backgroundColor';
const _backdropFilter = 'saturate(180%) blur(20px)';
const _borderColor = 'brand.navBar.borderColor';
// const _menuItemColor = 'brand.drawerMenu.item.color'; // TODO: fix
// const _menuItemBorderColor = 'brand.drawerMenu.item.borderColor'; // TODO: fix

const CategoriesWrapper = () => (
  <Container px="0">
    <CategoriesPopover />
  </Container>
);

const NavBarDesktop = ({ dark, logo: Logo, menuItems = [], simple }: NavBarProps) => {
  const issBrowser = isBrowser();
  const [user, setUser] = useState<User>();
  const isUserAdmin = user?.roles?.includes('admin'); // TODO: improve this
  const menuItemsWithOnClick = menuItems.map(i => (i.id === 'products' ? { ...i, menuContent: CategoriesWrapper } : i));

  useEffect(() => {
    if (issBrowser) setUser(lscache.get('user')); // TODO: improve this
  }, [issBrowser]);

  return (
    <>
      <Grid
        p="1.25rem 0"
        borderBottom="solid 1px"
        gridTemplateColumns="16rem 1fr auto auto auto "
        alignItems="center"
        bg={_backgroundColor}
        backdropFilter={_backdropFilter}
        borderBottomColor={_borderColor}
        gap="2rem"
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
          <SocialNeworks dark={dark} color={_navItemColor} size="1.2rem" hide={['tiktok', 'whatsapp']} />
        </GridItem>
        {isUserAdmin && (
          <GridItem>
            <MenuAdmin />
          </GridItem>
        )}
      </Grid>
      {!simple && (
        <Grid
          py="0.625rem"
          pl="1rem"
          borderBottom="solid 1px"
          gridTemplateColumns="2rem 1fr"
          alignItems="center"
          bg={'#800a0b'}
          borderBottomColor={_borderColor}
        >
          <GridItem ml="2rem">
            <Nav items={menuItemsWithOnClick} />
          </GridItem>
        </Grid>
      )}
    </>
  );
};

export default NavBarDesktop;
