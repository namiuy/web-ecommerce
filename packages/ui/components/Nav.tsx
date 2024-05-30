import Link from 'next/link';
import { Flex, Button, Popover, PopoverBody, PopoverContent, PopoverTrigger, PopoverArrow } from '@chakra-ui/react';
import { FunctionComponent, ReactElement } from 'react';
import { MdExpandMore } from 'react-icons/md';

const _itemColor = 'brand.nav.item.color';
const _itemHoverColor = 'brand.nav.item._hover.color';
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
  multiDomain?: boolean;
};

type NavItemProps = {
  children: ReactElement | string;
  multiDomain?: boolean;
};

const NavItem = ({ children }: NavItemProps) => (
  <Button
    bg="transparent"
    h="auto"
    p="0"
    borderRadius="0"
    color={_itemColor}
    fontSize={_fontSize}
    fontWeight={_fontWeight}
    _hover={{ color: _itemHoverColor }}
    _active={{ bg: 'transparent', color: _itemHoverColor }}
    _focus={{ bg: 'transparent', color: _itemHoverColor }}
  >
    {children}
  </Button>
);

const Nav = ({ items = [] }: NavProps) => {
  return (
    <nav>
      <Flex as="ol" listStyleType="none" gap="1.75rem" alignItems="baseline">
        {items.map(({ id, text, href, menuContent: Content }) => (
          <Flex as="li" key={id}>
            {Content ? (
              <Popover placement="bottom-start" trigger="hover" gutter={13}>
                <PopoverTrigger>
                  <Button
                    bg="transparent"
                    h="auto"
                    p="0"
                    borderRadius="0"
                    color={_itemColor}
                    fontSize={_fontSize}
                    fontWeight={_fontWeight}
                    _hover={{ color: _itemHoverColor }}
                    _active={{ bg: 'transparent', color: _itemHoverColor }}
                    _focus={{ bg: 'transparent', color: _itemHoverColor }}
                    rightIcon={<MdExpandMore />}
                    iconSpacing="0.125rem"
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
              <Link href={href}>
                <NavItem>{text}</NavItem>
              </Link>
            )}
          </Flex>
        ))}
      </Flex>
    </nav>
  );
};

export default Nav;
