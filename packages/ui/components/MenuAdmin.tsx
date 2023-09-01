import lscache from 'lscache';
import { Menu, MenuButton, MenuList, useDisclosure, Avatar, MenuItem, MenuGroup, Center } from '@chakra-ui/react';
import { MdAdd, MdLogout } from 'react-icons/md';
import { ProductAddModal } from './ProductCard/ProductAddModal';
import { User } from 'shared/entities/user';
import { useRouter } from 'next/router';
import { isBrowser } from 'shared';
import { useEffect, useState } from 'react';

const _secondaryColor = '#d7fc00'; // TODO: fix
const _borderRadious = '0.375rem';

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
  const isUserAdmin = roles?.includes('admin'); // TODO: improve this
  const userName = `${firstName} ${lastName}`;

  const handleSignOut = () => {
    lscache.remove('user');
    router.push('/');
  };

  return (
    <Menu>
      <MenuButton>
        <Avatar w="2rem" h="2rem" size="sm" bg={_secondaryColor} name={userName} />
      </MenuButton>
      <MenuList p="0">
        <MenuGroup title={userName}>
          <MenuItem icon={<MdLogout />} borderRadius={_borderRadious} onClick={handleSignOut}>
            Cerrar sesión
          </MenuItem>
        </MenuGroup>
        {isUserAdmin && (
          <MenuGroup title="Administrar">
            <MenuItem icon={<MdAdd />} borderRadius={_borderRadious} onClick={onOpen}>
              Agregar producto
            </MenuItem>
            <ProductAddModal isOpen={isOpen} onOpen={onOpen} onClose={onClose} />{' '}
          </MenuGroup>
        )}
      </MenuList>
    </Menu>
  );
};

export default MenuAdmin;
