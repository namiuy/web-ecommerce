import Link from 'next/link';
import { Flex, Button } from '@chakra-ui/react';
import { ReactElement } from 'react';
import { HiOutlineExternalLink } from 'react-icons/hi';

const _navItemColor = 'brand.nav.item.color';
const _itemHoverColor = 'brand.nav.item._hover.color';
const _fontSize = '0.8125rem';
const _fontWeight = '500';

export type NavItem = {
  id: string;
  text: string;
  href: string;
};

type NavProps = {
  items: NavItem[];
};

type NavItemProps = {
  children: ReactElement | string;
  color: string;
};

const NavItem = ({ children, color }: NavItemProps) => (
  <Button
    bg="transparent"
    h="auto"
    p="0"
    borderRadius="0"
    color={color}
    fontSize={_fontSize}
    fontWeight={_fontWeight}
    _hover={{ color: _itemHoverColor }}
    _active={{ bg: 'transparent', color: _itemHoverColor }}
    _focus={{ bg: 'transparent', color: _itemHoverColor }}
    rightIcon={<HiOutlineExternalLink />}
  >
    {children}
  </Button>
);

const NavMultiDomain = ({ items = [] }: NavProps) => {
  return (
    <nav>
      <Flex as="ol" listStyleType="none" gap="2.5rem" alignItems="center">
        {items.map(({ id, text, href }) => (
          <li key={id}>
            <Link href={href} target="_blank">
              <NavItem color={_navItemColor}>{text}</NavItem>
            </Link>
          </li>
        ))}
      </Flex>
    </nav>
  );
};

export default NavMultiDomain;
