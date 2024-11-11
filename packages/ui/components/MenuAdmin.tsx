import lscache from 'lscache';
import { Menu, MenuButton, MenuList, useDisclosure, Avatar, MenuItem, MenuGroup } from '@chakra-ui/react';
import { Flex, Text } from 'ui';
import { MdAdd, MdLogout } from 'react-icons/md';
import { ProductAddModal } from './ProductAddModal';
import { User } from 'shared/entities/user';
import { useRouter } from 'next/router';
import { isBrowser } from 'shared';
import { useEffect, useState } from 'react';
import { IoPerson } from 'react-icons/io5';

const _avatarBg = 'brand.avatar.backgroundColor';
const _avatarColor = 'brand.avatar.color';
const _borderRadious = '0.375rem';

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
    return <></>;
  }

  const { firstName, lastName, roles } = user;
  const isUserAdmin = user?.roles?.includes('admin') || user?.roles?.includes('seller'); // TODO: improve this
  const userName = `${firstName} ${lastName}`;

  const handleSignOut = () => {
    lscache.remove('access_token');
    lscache.remove('user');
    router.reload();
  };

  const handleProfile = () => {
    router.push('/perfil');
  };

  return (
    <Menu>
      <MenuButton>
        <Flex alignItems="center" gap="0.75rem" borderRadius="2rem" bg={_avatarBg} p="0.5rem 0.5rem 0.5rem 1rem">
          <Text color="white" fontWeight="semibold">
            {firstName}
          </Text>
          <Avatar
            w="2.25rem"
            h="2.25rem"
            size="md"
            bg={_backgroundColorSecondary}
            color={_avatarColor}
            // name={userName}
            icon={<IoPerson />}
          />
        </Flex>
      </MenuButton>
      <MenuList p="0" zIndex={999}>
        <MenuGroup title={userName}>
          <MenuItem icon={<IoPerson />} borderRadius={_borderRadious} onClick={handleProfile}>
            Mi perfil
          </MenuItem>
          <MenuItem icon={<MdLogout />} borderRadius={_borderRadious} onClick={handleSignOut}>
            Cerrar sesión
          </MenuItem>
        </MenuGroup>
        {isUserAdmin && (
          <MenuGroup title="Administrar">
            <MenuItem icon={<MdAdd />} borderRadius={_borderRadious} onClick={onOpen}>
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
