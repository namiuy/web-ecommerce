import {
  Box,
  Collapse,
  Grid,
  GridItem,
  Icon,
  IconButton as IconButtonChakra,
  IconButtonProps as IconButtonChakraProps,
  useDisclosure,
} from '@chakra-ui/react';
import SearchInput from '../SearchInput';
import { useEffect, useState, useRef, MutableRefObject } from 'react';
import { HiMenuAlt2 } from 'react-icons/hi';
import { MdOutlineShoppingCart } from 'react-icons/md';
import { NavBarProps } from '.';
import { IconType } from 'react-icons';
import Link from 'next/link';
import { MenuDrawer } from '../MenuDrawer';

const iconButtonColor = 'brand.navBar.iconButton.color';
const iconButtonHoverColor = 'brand.navBar.iconButton._hover.color';
const _backgroundColor = 'brand.navBar.backgroundColor';
const _borderColor = 'brand.navBar.borderColor';

type IconButtonProps = {
  buttonProps: IconButtonChakraProps & { ref?: MutableRefObject<null> };
  icon: IconType;
};

const IconButton = ({ buttonProps, icon }: IconButtonProps) => (
  <IconButtonChakra
    {...buttonProps}
    w="3rem"
    bg="transparent"
    icon={
      <Icon
        as={icon}
        w="1.75rem"
        h="1.75rem"
        display="block"
        color={iconButtonColor}
        _hover={{ color: iconButtonHoverColor }}
      />
    }
  />
);

const useScroll = () => {
  const [y, setY] = useState(0);

  useEffect(() => {
    const onScroll = () => setY(window.scrollY);
    window.removeEventListener('scroll', onScroll);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return [y];
};

const NavBarMobile = ({ logo: Logo, menuItems, socialNeworksItems }: NavBarProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef(null);
  const [scrollY] = useScroll();
  const showSearchInput = scrollY === 0;

  return (
    <>
      <Grid
        bg={_backgroundColor}
        //borderBottom={showSearchInput ? 'solid 0' : 'solid 1px'}
        //borderBottomColor={showSearchInput ? 'transparent' : _borderColor}
        borderBottom="solid 1px"
        borderBottomColor={_borderColor}
        gridTemplateColumns="auto 1rem 1fr 1rem auto"
        pt="1rem"
        pb="1rem"
        alignItems="center"
        transition="border-bottom 0.6s linear"
      >
        <GridItem>
          <IconButton
            buttonProps={{
              ml: '0.25rem',
              'aria-label': 'Menu',
              ref: btnRef,
              onClick: onOpen,
            }}
            icon={HiMenuAlt2}
          />
        </GridItem>
        <GridItem />
        <GridItem justifySelf="center">
          {Logo && (
            <Link href="/">
              <Logo />
            </Link>
          )}
        </GridItem>
        <GridItem />
        <GridItem>
          <IconButton buttonProps={{ mr: '0.25rem', 'aria-label': 'Carrito' }} icon={MdOutlineShoppingCart} />
        </GridItem>
        <GridItem gridColumn="1 / 6" pl="1rem" pr="1rem">
          <Collapse in={showSearchInput}>
            <Box h="1rem" />
            <SearchInput />
          </Collapse>
        </GridItem>
      </Grid>
      <MenuDrawer
        isOpen={isOpen}
        onClose={onClose}
        finalFocusRef={btnRef}
        menuItems={menuItems}
        socialNeworksItems={socialNeworksItems}
      />
    </>
  );
};

export default NavBarMobile;
