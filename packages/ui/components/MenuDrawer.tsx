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
import { MenuItem } from './NavBar';
import Link from 'next/link';
import { NavItem } from './Nav';
import SocialNetworks from './SocialNetworks';
import { CategoriesAccordion } from './CategoriesAccordion';
import { Center } from '..';
import MenuAdmin from './MenuAdmin';
import NavMultiDomain from './NavMultiDomain';
import { HiOutlineExternalLink } from 'react-icons/hi';

const _backgroundColor = 'brand.drawerMenu.backgroundColor';
const _backdropFilter = 'brand.drawerMenu.backdropFilter';
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
          <CategoriesAccordion
            removeParams
            onClick={onClick}
            color={_menuItemColor}
            borderColor={_menuItemBorderColor}
          />
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
  dark?: boolean;
  menuItems: Array<MenuItem>;
  multiDomainItems?: Array<MenuItem>;
};

export const MenuDrawer = ({ dark, isOpen, onClose, finalFocusRef, menuItems, multiDomainItems }: MenuDrawerProps) => (
  <Drawer isOpen={isOpen} placement="left" onClose={onClose} finalFocusRef={finalFocusRef}>
    <DrawerOverlay />
    <DrawerContent bg={_backgroundColor} backdropFilter="saturate(180%) blur(20px)">
      <DrawerCloseButton color={_menuItemColor} />
      <DrawerBody p=".5rem 0">
        <MenuDrawerItems items={menuItems} onClick={onClose} />
        <Box m="1rem">
          <MenuAdmin />
        </Box>
        {multiDomainItems && (
          <Box mx="1rem" py="1rem" borderY="1px solid" borderColor="blackAlpha.200">
            {multiDomainItems.map(({ id, text, href }) => (
              <Link key={id} href={href} target="_blank">
                <Flex alignItems="center" gap="0.5rem">
                  <Text
                    py="1rem"
                    color={_menuItemColor}
                    borderBottom="solid 1px"
                    borderColor={_menuItemBorderColor}
                    fontWeight="bold"
                  >
                    {text}
                  </Text>
                  <HiOutlineExternalLink />
                </Flex>
              </Link>
            ))}
          </Box>
        )}
        <Flex justifyContent="center" pt="2rem">
          <SocialNetworks dark={dark} color={_menuItemColor} size="2rem" hide={['whatsapp']} />
        </Flex>
      </DrawerBody>
    </DrawerContent>
  </Drawer>
);
