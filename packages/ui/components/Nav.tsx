// import Link from 'next/link'; // Preguntar a Nacho por qué puso Link de Next y no el de Chakra
import {
  Flex,
  Button,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  PopoverArrow,
  Link,
  Icon,
} from '@chakra-ui/react';
import { FunctionComponent, ReactElement } from 'react';
import { MdExpandMore } from 'react-icons/md';
import { Text } from '..';
import { HiOutlineExternalLink } from 'react-icons/hi';

const _itemColor = 'brand.nav.item.color';
const _itemHoverColor = 'brand.nav.item._hover.color';
//const _backdropFilter = 'saturate(180%) blur(20px)';
const _fontSize = '0.875rem';
const _multiFontSize = '0.75rem';
const _fontWeight = '600';
const _multiFontWeight = '500';

export type NavItem = {
  id: string;
  text: string;
  href: string;
  menuContent?: FunctionComponent;
};

type NavProps = {
  items: NavItem[];
  multiDomain?: boolean;
};

type NavItemProps = {
  children: ReactElement | string;
  multiDomain?: boolean;
};

const NavItem = ({ children, multiDomain }: NavItemProps) => (
  <Button
    bg="transparent"
    h="auto"
    p="0"
    borderRadius="0"
    color={_itemColor}
    fontSize={multiDomain ? _multiFontSize : _fontSize}
    fontWeight={multiDomain ? _multiFontWeight : _fontWeight}
    _hover={{ color: _itemHoverColor }}
    _active={{ bg: 'transparent', color: _itemHoverColor }}
    _focus={{ bg: 'transparent', color: _itemHoverColor }}
    rightIcon={multiDomain ? <HiOutlineExternalLink /> : undefined}
  >
    {children}
  </Button>
);

const Nav = ({ items = [], multiDomain }: NavProps) => {
  return (
    <nav>
      <Flex as="ol" listStyleType="none" gap="1.75rem" alignItems="center">
        {items.map(({ id, text, href, menuContent: Content }) => (
          <Flex as="li" key={id}>
            {Content ? (
              <Popover placement="bottom-start" trigger="hover" gutter={10}>
                <PopoverTrigger>
                  <Button
                    bg="transparent"
                    h="auto"
                    p="0"
                    borderRadius="0"
                    color={_itemColor}
                    fontSize={multiDomain ? _multiFontSize : _fontSize}
                    fontWeight={multiDomain ? _multiFontWeight : _fontWeight}
                    _hover={{ color: _itemHoverColor }}
                    _active={{ bg: 'transparent', color: _itemHoverColor }}
                    _focus={{ bg: 'transparent', color: _itemHoverColor }}
                    rightIcon={<MdExpandMore />}
                  >
                    {text}
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverArrow />
                  <PopoverBody p="0">
                    <Content />
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            ) : (
              <Link href={href} isExternal={multiDomain}>
                <NavItem multiDomain={multiDomain}>{text}</NavItem>
              </Link>
            )}
          </Flex>
        ))}
      </Flex>
    </nav>
  );
};

export default Nav;
