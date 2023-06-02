import { Grid, GridItem } from '@chakra-ui/react';
import Link from 'next/link';
import { useContext } from 'react';
import { NavBarProps } from '.';
import Nav from '../Nav';
import SearchInput from '../SearchInput';
import SocialNeworks from '../SocialNeworks';
import { AppContext } from 'shared';

const _navItemColor = 'brand.nav.item.color';
const _backgroundColor = 'brand.navBar.backgroundColor';
const _backdropFilter = 'saturate(180%) blur(20px)';
const _borderColor = 'brand.navBar.borderColor';

const NavBarDesktop = ({ logo: Logo, menuItems, socialNeworksItems }: NavBarProps) => {
  const { toggleTheme } = useContext(AppContext);

  return (
    <Grid
      height="6rem"
      borderBottom="solid 1px"
      gridTemplateColumns="16rem 1fr 2rem auto 2rem auto 2rem"
      alignItems="center"
      bg={_backgroundColor}
      backdropFilter={_backdropFilter}
      borderBottomColor={_borderColor}
    >
      <GridItem justifySelf="center">
        {Logo && (
          <div onClick={toggleTheme}>
            <Logo />
          </div>
          // <Link href="/">
          //   <Logo />
          // </Link>
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
        <SocialNeworks color={_navItemColor} items={socialNeworksItems} />
      </GridItem>
      <GridItem />
    </Grid>
  );
};

export default NavBarDesktop;
