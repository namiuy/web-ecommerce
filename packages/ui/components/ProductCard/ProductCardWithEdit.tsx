import { IconButton, Flex, useDisclosure } from '@chakra-ui/react';
import { FC } from 'react';
import { ProductCard, ProductCardProps } from './ProductCard';
import { ProductEditModal } from './ProductEditModal';
import { MdEdit } from 'react-icons/md';
import { IconButtonEdit } from '../IconButtonEdit';

const _translate = { base: 'translate(calc(8rem - 2.1rem), .1rem)', lg: 'translate(15rem, -1rem)' };

export const ProductCardWithEdit: FC<ProductCardProps> = props => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Flex>
      <ProductCard {...props} />
      <IconButtonEdit pos="absolute" transform={_translate} onClick={onOpen} aria-label="" />
      <ProductEditModal isOpen={isOpen} product={props.product} onOpen={onOpen} onClose={onClose} />
    </Flex>
  );
};
