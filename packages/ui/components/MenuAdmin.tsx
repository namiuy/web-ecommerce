import { Menu, MenuButton, MenuList, useDisclosure, Avatar, MenuItem, MenuGroup } from '@chakra-ui/react';
import { MdAdd, MdLogout } from 'react-icons/md';
import { ProductAddModal } from './ProductCard/ProductAddModal';

const _secondaryColor = '#d7fc00'; // TODO: fix
const _borderRadious = '0.375rem';

const MenuAdmin = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Menu>
      <MenuButton
        as={Avatar}
        display="inline-block"
        w="2rem"
        h="2rem"
        size="sm"
        bg={_secondaryColor}
        cursor="pointer"
        name="Ignacio Rodriguez"
      />
      <MenuList p="0">
        <MenuGroup title="Ignacio Rodriguez">
          <MenuItem icon={<MdLogout />} borderRadius={_borderRadious}>
            Cerrar sesión
          </MenuItem>
        </MenuGroup>
        <MenuGroup title="Administrar">
          <MenuItem icon={<MdAdd />} borderRadius={_borderRadious} onClick={onOpen}>
            Agregar producto
          </MenuItem>
          <ProductAddModal isOpen={isOpen} onOpen={onOpen} onClose={onClose} />{' '}
        </MenuGroup>
      </MenuList>
    </Menu>
  );
};

export default MenuAdmin;
