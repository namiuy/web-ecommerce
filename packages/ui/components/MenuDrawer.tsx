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
  Button,
  useDisclosure,
} from '@chakra-ui/react';
import { MenuItem } from './NavBar';
import Link from 'next/link';
import { NavItem } from './Nav';
import SocialNeworks from './SocialNeworks';
import { Categories } from './Categories';
import { Center } from '..';
import { ProductAddModal } from './ProductCard/ProductAddModal';

const _backgroundColor = 'brand.drawerMenu.backgroundColor';
const _backdropFilter = 'saturate(180%) blur(20px)';
const _menuItemColor = 'brand.drawerMenu.item.color';
const _menuItemBorderColor = 'brand.drawerMenu.item.borderColor';

type MenuDrawerItemsProps = {
  items: NavItem[];
  onClick(): void;
};

type AccordionProductsProps = {
  onClick(): void;
};

const AccordionProducts = ({ onClick }: AccordionProductsProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Accordion allowToggle borderBottom="solid 1px" borderColor={_menuItemBorderColor}>
      <AccordionItem borderColor={'transparent'}>
        <AccordionButton p="1rem">
          <Text flex="1" textAlign="left" color={_menuItemColor}>
            Productos
          </Text>
          <AccordionIcon color={_menuItemColor} />
        </AccordionButton>
        <AccordionPanel p="0">
          <Categories removeParams onClick={onClick} color={_menuItemColor} borderColor={_menuItemBorderColor} />
          <Button onClick={onOpen}>Nuevo</Button>
          <ProductAddModal isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

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
              <Text p="1rem" color={_menuItemColor} borderBottom="solid 1px" borderColor={_menuItemBorderColor}>
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
};

export const MenuDrawer = ({ isOpen, onClose, finalFocusRef, menuItems }: MenuDrawerProps) => (
  <Drawer isOpen={isOpen} placement="left" onClose={onClose} finalFocusRef={finalFocusRef}>
    <DrawerOverlay />
    <DrawerContent bg={_backgroundColor} backdropFilter={_backdropFilter}>
      <DrawerCloseButton color={_menuItemColor} />
      <DrawerBody p=".5rem 0">
        <MenuDrawerItems items={menuItems} onClick={onClose} />
        <Box p="2rem 0">
          <Center>
            <SocialNeworks dark color={_menuItemColor} size="2rem" />
          </Center>
        </Box>
      </DrawerBody>
    </DrawerContent>
  </Drawer>
);
