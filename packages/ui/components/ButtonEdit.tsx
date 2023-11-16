import { Button, ButtonProps } from '@chakra-ui/react';
import { FC } from 'react';
import { MdEdit } from 'react-icons/md';

export const ButtonEdit: FC<ButtonProps> = ({ onClick }) => (
  <Button
    leftIcon={<MdEdit />}
    width="fit-content"
    size="sm"
    px="0"
    variant="ghost"
    color="brand.grey.2"
    _hover={{ bg: 'none', color: 'brand.grey.3' }}
    onClick={onClick}
  >
    Editar
  </Button>
);
