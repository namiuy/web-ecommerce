import lscache from 'lscache';
import { Icon, Link } from '@chakra-ui/react';
import { Flex, Text } from 'ui';
import { UserMenu } from './UserMenu';
import { getAppName, isBrowser } from 'shared';
import { FiBox } from 'react-icons/fi';
import { HiOutlineShoppingCart } from 'react-icons/hi2';
import { IoMdPhotos } from 'react-icons/io';
import { useEffect, useState } from 'react';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();
const sidebarOptions = publicRuntimeConfig.sidebarOptions || [];

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
    borderRadius="0.5rem"
    bg={currentPage === path ? '#f2f2f2' : 'white'}
    color={currentPage === path ? 'black' : 'gray'}
    fontWeight="medium"
    fontSize="0.875rem"
    w="100%"
    justifyContent="start"
    gap="0.75rem"
    _hover={{ color: 'black', bg: '#e0dede' }}
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

export const SideBar = ({ currentPage }: SiderBarProps) => {
  const issBrowser = isBrowser();
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [isUserImageUploader, setIsUserImageUploader] = useState(false);

  useEffect(() => {
    if (issBrowser) {
      const user = lscache.get('user');
      setIsUserAdmin(user?.roles?.includes('admin') || user?.roles?.includes('seller'));
      setIsUserImageUploader(user?.roles?.includes('imageuploader'));
    }
  }, [issBrowser]);

  return (
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
        <Text fontWeight="semibold" mt="0.5rem" mb="1.5rem" fontSize="1.125rem">
          {getAppName()}
        </Text>
        <Flex flexDir="column" gap="0.625rem" alignItems="start">
          {sidebarOptions.includes('orders') && (
            <SidebarButton path="ordenes" text="Ordenes" icon={HiOutlineShoppingCart} currentPage={currentPage} />
          )}
          {sidebarOptions.includes('products') && isUserAdmin && (
            <SidebarButton path="productos" text="Productos" icon={FiBox} currentPage={currentPage} />
          )}
          {sidebarOptions.includes('photos') && (isUserImageUploader || isUserAdmin) && (
            <SidebarButton path="fotos" text="Fotos" icon={IoMdPhotos} currentPage={currentPage} />
          )}
        </Flex>
      </Flex>
      <UserMenu />
    </Flex>
  );
};
