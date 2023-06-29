import { Circle, IconButton, Flex, useDisclosure } from '@chakra-ui/react';
import { FC } from 'react';
import { ProductCard, ProductCardProps } from './ProductCard';
import { ProductEditModal } from './ProductEditModal';
import { MdEdit } from 'react-icons/md';

// _cardW = { base: '8rem', lg: '12rem' };
const _translate = { base: 'translate(calc(8rem - 2.1rem), .1rem)', lg: 'translate(calc(12rem - 2.1rem), .1rem)' };

export const ProductCardWithEdit: FC<ProductCardProps> = props => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Flex>
      <ProductCard {...props} />
      <IconButton
        w="2rem"
        h="2rem"
        minW="none"
        pos="absolute"
        aria-label=""
        bg="none"
        color="grey"
        icon={<MdEdit />}
        borderRadius="2rem"
        onClick={onOpen}
        transform={_translate}
        _hover={{ bg: 'white', color: 'black' }}
      />
      <ProductEditModal isOpen={isOpen} product={props.product} onOpen={onOpen} onClose={onClose} />
    </Flex>
  );
};
