import { Icon, Skeleton } from '@chakra-ui/react';
import { Button } from 'ui';
import { BiSolidShoppingBag } from 'react-icons/bi';
import { FC } from 'react';
import { ProductActionProps } from '../templates/ProductDetail';

export const AddToCartButton: FC<ProductActionProps> = ({ isLoading, product }) =>
  isLoading ? (
    <Skeleton w="100%" h="2.5rem" />
  ) : (
    <>
      <Button
        width="100%"
        bg="primary.main"
        color="white"
        my="1rem"
        isDisabled={!product || product?.stock !== 'AV'}
        _hover={{ backgroundColor: 'primary.main' }}
      >
        COMPRAR <Icon as={BiSolidShoppingBag} ml="5px" boxSize="4" mb="3px" />
      </Button>
      <Button
        width="100%"
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
