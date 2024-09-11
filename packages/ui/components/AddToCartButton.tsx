import { Icon, Spinner, useToast } from '@chakra-ui/react';
import { Button, Skeleton } from 'ui';
import { BiSolidShoppingBag } from 'react-icons/bi';
import { useCart } from 'shared';
import { ProductActionProps } from '../templates/ProductDetail';

export const AddToCartButton = ({ isLoading, product, quantity }: ProductActionProps) => {
  const toast = useToast();

  const onError = (error: string) => {
    if (error == 'Stock Insuficiente') {
      toast({
        title: 'No se pudieron agregar todos los productos',
        status: 'warning',
        duration: 3000,
        isClosable: false,
      });
    }
    if (error == 'No se Agrego') {
      toast({
        title: 'No hay stock suficiente',
        status: 'error',
        duration: 3000,
        isClosable: false,
      });
    }
  };

  const { addToCart, isLoading: isLoadingAdd } = useCart({ onError });

  const handleAddToCart = () => {
    addToCart(product!!.id, quantity!!);
  };

  return (
    <>
      {isLoading ? (
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
            bg="white"
            color="primary.main"
            border="2px"
            borderColor="primary.main"
            _hover={{ backgroundColor: 'secondary.main', color: 'white', borderColor: 'secondary.main' }}
            isDisabled={!product || product?.stock != 'AV' || isLoadingAdd}
            onClick={handleAddToCart}
          >
            {isLoadingAdd ? (
              <Spinner />
            ) : (
              <>
                AGREGAR AL CARRITO <Icon as={BiSolidShoppingBag} ml="5px" boxSize="4" mb="3px" />
              </>
            )}
          </Button>
          <Button
            width="100%"
            height="2.75rem"
            borderRadius="0.5rem"
            bg="primary.main"
            color="white"
            my="1rem"
            _hover={{ backgroundColor: 'secondary.main' }}
            isDisabled={!product || product?.stock != 'AV' || isLoadingAdd}
          >
            {isLoadingAdd ? (
              <Spinner />
            ) : (
              <>
                COMPRAR <Icon as={BiSolidShoppingBag} ml="5px" boxSize="4" mb="3px" />
              </>
            )}
          </Button>
        </>
      )}
    </>
  );
};
