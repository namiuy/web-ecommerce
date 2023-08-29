import { Grid, GridItem } from '@chakra-ui/react';
import { NavBarProps } from '.';
import Nav from '../Nav';
import SearchInput from '../SearchInput';
import SocialNeworks from '../SocialNeworks';
import Link from 'next/link';
import { Categories } from '../Categories';
import MenuAdmin from '../MenuAdmin';

const _navItemColor = 'brand.nav.item.color';
const _backgroundColor = 'brand.navBar.backgroundColor';
const _backdropFilter = 'saturate(180%) blur(20px)';
const _borderColor = 'brand.navBar.borderColor';
const _menuItemColor = 'brand.drawerMenu.item.color'; // TODO: fix
const _menuItemBorderColor = 'brand.drawerMenu.item.borderColor'; // TODO: fix

const NavBarDesktop = ({ dark, logo: Logo, menuItems = [] }: NavBarProps) => {
  const menuItemsWithOnClick = menuItems.map(i => (i.id === 'products' ? { ...i, menuContent: Categories } : i));
  return (
    <Grid
      p="1.5rem 0"
      borderBottom="solid 1px"
      gridTemplateColumns="16rem 1fr 2rem auto 2rem auto 2rem auto 1rem"
      alignItems="center"
      bg={_backgroundColor}
      backdropFilter={_backdropFilter}
      borderBottomColor={_borderColor}
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
      <GridItem />
      <GridItem>
        <Nav items={menuItemsWithOnClick} />
      </GridItem>
      <GridItem />
      <GridItem>
        <SocialNeworks dark={dark} color={_navItemColor} size="1.2rem" />
      </GridItem>
      <GridItem />
      {/* <GridItem>
        <MenuAdmin />
      </GridItem> */}
      <GridItem />
    </Grid>
  );
};

export default NavBarDesktop;
