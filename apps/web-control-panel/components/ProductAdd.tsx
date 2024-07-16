import { useDisclosure } from '@chakra-ui/react';
import { Button, ProductAddModal } from 'ui';

import { FaPlus } from 'react-icons/fa';

export const ProductAdd = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button onClick={onOpen} bg="#f2f2f2" borderColor="#f2f2f2" leftIcon={<FaPlus />}>
        Agregar producto
      </Button>
      <ProductAddModal isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
    </>
  );
};
