import { Button, ButtonProps } from '@chakra-ui/react';
import { MdEdit } from 'react-icons/md';

export const ButtonEdit = ({ onClick }: ButtonProps) => (
  <Button
    leftIcon={<MdEdit />}
    width="fit-content"
    h="auto"
    size="sm"
    mt="0.5rem"
    px="0"
    variant="ghost"
    color="brand.grey.2"
    _hover={{ bg: 'none', color: 'brand.grey.3' }}
    onClick={onClick}
  >
    Editar
  </Button>
);
