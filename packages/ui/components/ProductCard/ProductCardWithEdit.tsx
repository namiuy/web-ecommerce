import { Flex, useDisclosure, Button } from '@chakra-ui/react';
import { FC } from 'react';
import { MdEdit } from 'react-icons/md';
import { ProductCard, ProductCardProps } from './ProductCard';
import { ProductEditModal } from './ProductEditModal';
import { ButtonEdit } from '../ButtonEdit';

export const ProductCardWithEdit: FC<ProductCardProps> = props => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Flex flexDir="column">
      <ProductCard {...props} />
      <ButtonEdit onClick={onOpen} />
      <ProductEditModal isOpen={isOpen} product={props.product} onOpen={onOpen} onClose={onClose} />
    </Flex>
  );
};
