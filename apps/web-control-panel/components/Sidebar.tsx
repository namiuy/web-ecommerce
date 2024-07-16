import { Flex, Box, Text, Button } from 'ui';
import { FaBarsStaggered } from 'react-icons/fa6';
import { HiOutlineShoppingCart } from 'react-icons/hi2';
import { FaRegImage } from 'react-icons/fa';
import { FiBox } from 'react-icons/fi';
import { CiBoxList } from 'react-icons/ci';
import { IoPricetagsOutline } from 'react-icons/io5';
import { Icon, Link } from '@chakra-ui/react';
import { UserMenu } from './UserMenu';
import { appName } from 'shared'

const _borderColor = '#f2f2f2';

type SidebarButtonProps = {
  path: string;
  text: string;
  icon: any;
  currentPage?: string;
};

const SidebarButton = ({ path, text, icon, currentPage }: SidebarButtonProps) => (
  <Link
    href={`/${path}`}
    display="flex"
    alignItems="center"
    borderRadius={'0.5rem'}
    bg={currentPage == path ? '#f2f2f2' : 'white'}
    color={currentPage == path ? 'black' : 'gray'}
    fontWeight={'medium'}
    fontSize={'0.875rem'}
    w="100%"
    justifyContent="start"
    gap="0.75rem"
    _hover={currentPage == path ? { color: 'black', bg: '#e0dede' } : { color: 'black', bg: '#e0dede' }}
    py="0.375rem"
    px="0.75rem"
  >
    <Icon as={icon} boxSize={5} />
    {text}
  </Link>
);

type SiderBarProps = {
  currentPage?: string;
};

export const SideBar = ({ currentPage }: SiderBarProps) => (
  <Flex
    flexDir="column"
    justifyContent="space-between"
    minW="15rem"
    minH="100vh"
    borderRight="2px solid"
    borderColor={_borderColor}
    p="1.25rem"
  >
    <Flex flexDir="column">
      <Text fontWeight="semibold" my="1.5rem" fontSize="1.125rem">
        {appName}
      </Text>
      <Flex flexDir="column" gap="0.625rem" alignItems="start">
        <SidebarButton path="productos" text="Productos" icon={FiBox} currentPage={currentPage} />
        {/* <SidebarButton path="listas" text="Listas de productos" icon={CiBoxList} currentPage={currentPage} />
        <SidebarButton path="categorias" text="Categorias" icon={IoPricetagsOutline} currentPage={currentPage} />
        <SidebarButton path="marcas" text="Marcas" icon={FaBarsStaggered} currentPage={currentPage} />
        <SidebarButton path="ordenes" text="Ordenes" icon={HiOutlineShoppingCart} currentPage={currentPage} />
        <SidebarButton path="banners" text="Banners" icon={FaRegImage} currentPage={currentPage} /> */}
      </Flex>
    </Flex>
    <UserMenu />
  </Flex>
);
