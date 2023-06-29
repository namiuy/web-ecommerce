import Link from 'next/link';
import { Flex, Menu, MenuButton, MenuList, Button } from '@chakra-ui/react';
import { FunctionComponent, ReactElement } from 'react';
import { MdExpandMore } from 'react-icons/md';
import { Text } from '..';

const _itemColor = 'brand.nav.item.color';
const _itemHoverColor = 'brand.nav.item._hover.color';
//const _backdropFilter = 'saturate(180%) blur(20px)';
const _fontSize = '0.875rem';
const _fontWeight = '600';

export type NavItem = {
  id: string;
  text: string;
  href: string;
  menuContent?: FunctionComponent;
};

type NavProps = {
  items: NavItem[];
};

type NavItemProps = {
  children: ReactElement | string;
};

const NavItem = ({ children }: NavItemProps) => (
  <Text fontSize={_fontSize} color={_itemColor} _hover={{ color: _itemHoverColor }} fontWeight={_fontWeight}>
    {children}
  </Text>
);

const Nav = ({ items = [] }: NavProps) => (
  <nav>
    <Flex as="ol" listStyleType="none" gap="2rem" alignItems="center">
      {items.map(({ id, text, href, menuContent: Content }) => (
        <li key={id}>
          {Content ? (
            <Menu>
              <MenuButton
                as={Button}
                bg="transparent"
                h="auto"
                p="0"
                color={_itemColor}
                fontSize={_fontSize}
                fontWeight={_fontWeight}
                rightIcon={<MdExpandMore />}
                _hover={{ color: _itemHoverColor }}
                _active={{ bg: 'transparent', color: _itemHoverColor }}
                _focus={{ bg: 'transparent', color: _itemHoverColor }}
              >
                {text}
              </MenuButton>
              <MenuList p="0">
                <Content />
              </MenuList>
            </Menu>
          ) : (
            <Link href={href}>
              <NavItem>{text}</NavItem>
            </Link>
          )}
        </li>
      ))}
    </Flex>
  </nav>
);

export default Nav;
