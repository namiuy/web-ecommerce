import lscache from 'lscache';
import { Menu, MenuItem, MenuGroup, MenuButton, MenuList, useDisclosure, Avatar } from '@chakra-ui/react';
import { Button, Flex, Text } from 'ui';
import { cartEnabled, useCurrentUser } from 'shared';
import { useRouter } from 'next/router';
import { MdLogout } from 'react-icons/md';
import { IoPerson } from 'react-icons/io5';
import { FaShoppingBag } from 'react-icons/fa';
import { firebaseSignOut } from 'shared/services/firebase';

const _avatarColor = 'brand.avatar.color';
const _borderRadius = '0.375rem';

const MenuAdmin = () => {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Use the new hook that syncs with Firebase Auth
  const { user, isLoading } = useCurrentUser();

  if (!user) {
    return (
      <Button
        onClick={() => router.replace('/iniciar')}
        bg="secondary.main"
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
  const userName = `${first_name} ${last_name}`;

  const handleSignOut = async () => {
    try {
      // Sign out from Firebase
      await firebaseSignOut();

      // Remove tokens and user data from localStorage
      lscache.remove('firebase_token');
      lscache.remove('user');

      // Reload the page to reset state
      router.reload();
    } catch (error) {
      console.error('Error signing out:', error);
      // Even if Firebase signout fails, clear local data
      lscache.remove('firebase_token');
      lscache.remove('user');
      router.reload();
    }
  };

  const handleProfile = () => {
    router.replace('/perfil');
  };

  const handleOrderHistory = () => {
    router.replace('/mis-compras');
  };

  return (
    <Menu>
      <MenuButton borderRadius="0.5rem" bg="secondary.main" px="0" _hover={{ bg: 'primary.main' }}>
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
          {cartEnabled && (
            <MenuItem icon={<FaShoppingBag />} borderRadius={_borderRadius} onClick={handleOrderHistory}>
              Mis compras
            </MenuItem>
          )}
          <MenuItem icon={<MdLogout />} borderRadius={_borderRadius} onClick={handleSignOut}>
            Cerrar sesión
          </MenuItem>
        </MenuGroup>
      </MenuList>
    </Menu>
  );
};

export default MenuAdmin;
