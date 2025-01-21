import lscache from 'lscache';
import { Menu, MenuButton, MenuList, useDisclosure, Avatar, MenuItem, MenuGroup } from '@chakra-ui/react';
import { Button, Flex, Text } from 'ui';
import { MdAdd, MdLogout } from 'react-icons/md';
import { ProductAddModal } from './ProductAddModal';
import { User } from 'shared/entities/user';
import { useRouter } from 'next/router';
import { isBrowser } from 'shared';
import { useEffect, useState } from 'react';
import { IoPerson } from 'react-icons/io5';
import { FaShoppingBag } from 'react-icons/fa';

const _avatarBg = 'brand.avatar.backgroundColor';
const _avatarColor = 'brand.avatar.color';
const _borderRadius = '0.375rem';

const _backgroundColorPrimary = 'brand.navBar.backgroundColorPrimary';
const _backgroundColorSecondary = 'brand.navBar.backgroundColorSecondary';

const MenuAdmin = () => {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const issBrowser = isBrowser();
  const [user, setUser] = useState<User>();

  useEffect(() => {
    if (issBrowser) setUser(lscache.get('user')); // TODO: improve this
  }, [issBrowser]);

  if (!user) {
    return (
      <Button
        onClick={() => router.replace('/iniciar')}
        bg="transparent"
        px="0"
        borderRadius="0.5rem"
        h="100%"
        _hover={{ bg: 'primary.main' }}
      >
        <Flex alignItems="center" gap="0.5rem" pr="1rem">
          <Avatar w="3rem" h="3rem" size="lg" bg="transparent" color="white" icon={<IoPerson />} />
          <Text color="white" fontWeight="medium" fontSize="0.875rem">
            Iniciar sesión
          </Text>
        </Flex>
      </Button>
    );
  }

  const { first_name, last_name } = user;
  const isUserAdmin = user?.roles?.includes('admin') || user?.roles?.includes('seller'); // TODO: improve this
  const userName = `${first_name} ${last_name}`;

  const handleSignOut = () => {
    lscache.remove('access_token');
    lscache.remove('user');
    router.reload();
  };

  const handleProfile = () => {
    router.replace('/perfil');
  };

  const handleOrderHistory = () => {
    router.replace('/mis-compras');
  };

  return (
    <Menu>
      <MenuButton _hover={{ bg: 'primary.main' }} borderRadius="0.5rem" bg="secondary.main" px="0">
        <Flex alignItems="center" gap="0.5rem" bg="transparent">
          <Avatar w="3rem" h="3rem" size="lg" bg="transparent" color={_avatarColor} icon={<IoPerson />} />
          <Text color="white" fontWeight="medium" fontSize="0.875rem" pr="1rem">
            {first_name} {last_name}
          </Text>
        </Flex>
      </MenuButton>
      <MenuList p="0" zIndex={999}>
        <MenuGroup title={userName}>
          <MenuItem icon={<IoPerson />} borderRadius={_borderRadius} onClick={handleProfile}>
            Mi perfil
          </MenuItem>
          <MenuItem icon={<MdLogout />} borderRadius={_borderRadius} onClick={handleSignOut}>
            Cerrar sesión
          </MenuItem>
        </MenuGroup>
        {isUserAdmin && (
          <MenuGroup title="Administrar">
            <MenuItem icon={<MdAdd />} borderRadius={_borderRadius} onClick={onOpen}>
              Agregar producto
            </MenuItem>
            <ProductAddModal isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
          </MenuGroup>
        )}
      </MenuList>
    </Menu>
  );
};

export default MenuAdmin;
