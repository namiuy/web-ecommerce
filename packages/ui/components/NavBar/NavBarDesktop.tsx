import { Collapse, Grid, GridItem } from '@chakra-ui/react';
import { useContext } from 'react';
import { NavBarProps } from '.';
import Nav from '../Nav';
import SearchInput from '../SearchInput';
import SocialNeworks from '../SocialNeworks';
import { AppContext } from 'shared';
import Link from 'next/link';
import { AnimationWrapper } from '../AnimationWrapper';
import { Categories } from '../Categories';

const _navItemColor = 'brand.nav.item.color';
const _backgroundColor = 'brand.navBar.backgroundColor';
const _backdropFilter = 'saturate(180%) blur(20px)';
const _borderColor = 'brand.navBar.borderColor';
const _menuItemColor = 'brand.drawerMenu.item.color'; // TODO: fix
const _menuItemBorderColor = 'brand.drawerMenu.item.borderColor'; // TODO: fix

const NavBarDesktop = ({ logo: Logo, menuItems = [] }: NavBarProps) => {
  const { toggleTheme } = useContext(AppContext);
  const menuItemsWithOnClick = menuItems.map(i => (i.id === 'products' ? { ...i, menuContent: Categories } : i));
  return (
    <>
      <Grid
        p="1.5rem 0"
        borderBottom="solid 1px"
        gridTemplateColumns="16rem 1fr 2rem auto 2rem auto 2rem"
        alignItems="center"
        bg={_backgroundColor}
        backdropFilter={_backdropFilter}
        borderBottomColor={_borderColor}
      >
        <GridItem justifySelf="center">
          {Logo && (
            <AnimationWrapper tag="a">
              <div onClick={toggleTheme}>
                <Link href="/">
                  <Logo />
                </Link>
              </div>
            </AnimationWrapper>
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
          <SocialNeworks color={_navItemColor} size="1.2rem" />
        </GridItem>
        <GridItem />
      </Grid>
      {/* <Box bg={_backgroundColor} backdropFilter={_backdropFilter}>
        <Collapse in={showCategories}>
          <Categories removeParams onClick={undefined} color={_menuItemColor} borderColor={_menuItemBorderColor} />
        </Collapse>
      </Box> */}
    </>
  );
};

export default NavBarDesktop;
