import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  DrawerProps,
  Flex,
  Text,
} from '@chakra-ui/react';
import { MenuItem, SocialNeworkItem } from './NavBar';
import Link from 'next/link';
import { NavItem } from './Nav';
import SocialNeworks from './SocialNeworks';

const menuItemColor = 'brand.drawerMenu.item.color';

type MenuDrawerItemsProps = {
  items: NavItem[];
};

const MenuDrawerItems = ({ items = [] }: MenuDrawerItemsProps) => (
  <nav>
    <Flex direction="column" as="ol" listStyleType="none">
      <Box h="2rem" />
      {items.map(({ id, text, href }) => (
        <li key={id}>
          <Link href={href}>
            <Text pt="1rem" pb="1rem" fontSize="0.875rem" color={menuItemColor}>
              {text}
            </Text>
          </Link>
        </li>
      ))}
    </Flex>
  </nav>
);

type MenuDrawerProps = Omit<DrawerProps, 'children'> & {
  menuItems: Array<MenuItem>;
  socialNeworksItems: Array<SocialNeworkItem>;
};

export const MenuDrawer = ({ isOpen, onClose, finalFocusRef, menuItems, socialNeworksItems }: MenuDrawerProps) => (
  <Drawer isOpen={isOpen} placement="left" onClose={onClose} finalFocusRef={finalFocusRef}>
    <DrawerOverlay />
    <DrawerContent>
      <DrawerCloseButton />
      <DrawerBody>
        <MenuDrawerItems items={menuItems} />
        <SocialNeworks color={menuItemColor} items={socialNeworksItems} />
      </DrawerBody>
    </DrawerContent>
  </Drawer>
);
