import {
  Grid,
  GridItem,
  Icon,
  IconButton as IconButtonChakra,
  IconButtonProps as IconButtonChakraProps,
  useDisclosure,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
} from '@chakra-ui/react';
import { useRef, MutableRefObject } from 'react';
import { HiMenuAlt2 } from 'react-icons/hi';
import { AiOutlineSearch } from 'react-icons/ai';
import { NavBarProps } from '.';
import { IconType } from 'react-icons';
import { MenuDrawer } from '../MenuDrawer';
import Link from 'next/link';
import SearchInput from '../SearchInput';
import { ShoppingCartDrawer } from '../ShoppingCartDrawer';

const iconButtonColor = 'brand.navBar.iconButton.color';
const iconButtonHoverColor = 'brand.navBar.iconButton._hover.color';
const _backgroundColorPrimary = 'brand.navBar.backgroundColorPrimary';
const _backgroundColorSecondary = 'brand.navBar.backgroundColorSecondary';
const _backdropFilter = 'saturate(180%) blur(20px)';
const _borderColor = 'brand.navBar.borderColor';
const _color = 'brand.navBar.color';

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
        _hover={{ bg: iconButtonHoverColor }}
      />
    }
  />
);

const SearchButton = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <IconButton
        icon={AiOutlineSearch}
        buttonProps={{ mr: '0.25rem', 'aria-label': 'Carrito', onClick: onOpen, _hover: { bg: iconButtonHoverColor } }}
      />
      <Modal isOpen={isOpen} size="5xl" onClose={onClose}>
        <ModalOverlay bg={_backgroundColorSecondary} backdropFilter={_backdropFilter} />
        <ModalContent m=".5rem 0 0" bg="transparent">
          <ModalCloseButton color="white" />
          <ModalBody pt="3.5rem">
            <SearchInput onSearch={onClose} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

const NavBarMobile = ({ dark, logo: Logo, menuItems = [], multiDomainItems }: NavBarProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef(null);

  return (
    <>
      <Grid
        bg={_backgroundColorPrimary}
        backdropFilter={_backdropFilter}
        color={_color}
        borderBottomColor={_borderColor}
        gridTemplateColumns="1fr 3fr auto auto"
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
              _hover: { bg: iconButtonHoverColor },
            }}
            icon={HiMenuAlt2}
          />
        </GridItem>
        <GridItem justifySelf="center">
          {Logo && (
            <Link href="/">
              <Logo />
            </Link>
          )}
        </GridItem>
        <GridItem>
          <ShoppingCartDrawer />
        </GridItem>
        <GridItem>
          <SearchButton />
        </GridItem>
      </Grid>
      <MenuDrawer
        dark={dark}
        isOpen={isOpen}
        onClose={onClose}
        finalFocusRef={btnRef}
        menuItems={menuItems}
        multiDomainItems={multiDomainItems}
      />
    </>
  );
};

export default NavBarMobile;
