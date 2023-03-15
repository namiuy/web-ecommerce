import { Grid, GridItem } from '@chakra-ui/react';
import Link from 'next/link';
import { NavBarProps } from '.';
import Nav from '../Nav';
import SearchInput from '../SearchInput';
import SocialNeworks from '../SocialNeworks';

const navItemColor = 'brand.nav.item.color';
const _backgroundColor = 'brand.navBar.backgroundColor';
const _borderColor = 'brand.navBar.borderColor';

const NavBarDesktop = ({ logo: Logo, menuItems, socialNeworksItems }: NavBarProps) => (
  <Grid
    height="6rem"
    borderBottom="solid 1px"
    gridTemplateColumns="16rem 1fr 2rem auto 2rem auto 2rem"
    alignItems="center"
    bg={_backgroundColor}
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
      <Nav items={menuItems} />
    </GridItem>
    <GridItem />
    <GridItem>
      <SocialNeworks color={navItemColor} items={socialNeworksItems} />
    </GridItem>
    <GridItem />
  </Grid>
);

export default NavBarDesktop;
