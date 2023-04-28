import {
  Accordion,
  AccordionItem,
  AccordionIcon,
  AccordionButton,
  AccordionPanel,
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
import { Categories } from './Categories';

const _menuItemColor = 'brand.drawerMenu.item.color';
const _grey0 = 'brand.grey.0';
const _grey3 = 'brand.grey.3';

type MenuDrawerItemsProps = {
  items: NavItem[];
  onClick(): void;
};

type AccordionProductsProps = {
  onClick(): void;
};

const AccordionProducts = ({ onClick }: AccordionProductsProps) => (
  <Accordion allowToggle borderBottom="solid 1px" borderColor={_grey0}>
    <AccordionItem borderColor={'transparent'}>
      <AccordionButton p="1rem">
        <Text flex="1" textAlign="left" color={_menuItemColor}>
          Productos
        </Text>
        <AccordionIcon color={_grey3} />
      </AccordionButton>
      <AccordionPanel p="0">
        <Categories onClick={onClick} />
      </AccordionPanel>
    </AccordionItem>
  </Accordion>
);

const MenuDrawerItems = ({ items, onClick }: MenuDrawerItemsProps) => (
  <nav>
    <Flex direction="column" as="ol" listStyleType="none">
      <Box h="2rem" />
      {items.map(({ id, text, href }) => (
        <li key={id}>
          {id === 'products' ? (
            <AccordionProducts onClick={onClick} />
          ) : (
            <Link href={href}>
              <Text p="1rem" color={_menuItemColor} borderBottom="solid 1px" borderColor={_grey0}>
                {text}
              </Text>
            </Link>
          )}
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
      <DrawerBody p=".5rem 0">
        <MenuDrawerItems items={menuItems} onClick={onClose} />
        <Box p="1rem">
          <SocialNeworks color={_menuItemColor} items={socialNeworksItems} />
        </Box>
      </DrawerBody>
    </DrawerContent>
  </Drawer>
);
