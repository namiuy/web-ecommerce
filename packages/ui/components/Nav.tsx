import Link from 'next/link';
import { Flex, Text } from '@chakra-ui/react';

const _itemColor = 'brand.nav.item.color';
const _itemHoverColor = 'brand.nav.item._hover.color';

export type NavItem = {
  id: string;
  text: string;
  href: string;
};

type NavProps = {
  items: NavItem[];
};

const Nav = ({ items = [] }: NavProps) => (
  <nav>
    <Flex as="ol" listStyleType="none" gap="2rem">
      {items.map(({ id, text, href }) => (
        <li key={id}>
          <Link href={href}>
            <Text fontSize="0.875rem" color={_itemColor} _hover={{ color: _itemHoverColor }} fontWeight="600">
              {text}
            </Text>
          </Link>
        </li>
      ))}
    </Flex>
  </nav>
);

export default Nav;
