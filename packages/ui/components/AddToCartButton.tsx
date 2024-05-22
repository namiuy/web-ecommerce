import { Icon, Skeleton } from '@chakra-ui/react';
import { Button } from 'ui';
import { BiSolidShoppingBag } from 'react-icons/bi';
import { ProductActionProps } from '../templates/ProductDetail';

export const AddToCartButton = ({ isLoading, product }: ProductActionProps) =>
  isLoading ? (
    <>
      <Skeleton w="100%" h="2.75rem" my="1rem" />
      <Skeleton w="100%" h="2.75rem" />
    </>
  ) : (
    <>
      <Button
        width="100%"
        height="2.75rem"
        borderRadius="0.5rem"
        bg="primary.main"
        color="white"
        my="1rem"
        _hover={{ backgroundColor: 'primary.main' }}
        isDisabled={!product || product?.stock !== 'AV'}
      >
        COMPRAR <Icon as={BiSolidShoppingBag} ml="5px" boxSize="4" mb="3px" />
      </Button>
      <Button
        width="100%"
        height={'2.75rem'}
        borderRadius="0.5rem"
        bg="white"
        color="primary.main"
        border="2px"
        borderColor="primary.main"
        _hover={{ backgroundColor: 'primary.main', color: 'white', borderColor: 'primary.main' }}
        isDisabled={!product || product?.stock !== 'AV'}
      >
        AGREGAR AL CARRITO <Icon as={BiSolidShoppingBag} ml="5px" boxSize="4" mb="3px" />
      </Button>
    </>
  );
