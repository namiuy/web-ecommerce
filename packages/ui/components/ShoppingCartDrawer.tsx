import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  IconButton,
  Spinner,
  Icon,
  useToast,
} from '@chakra-ui/react';
import { Button, Image, Text, Grid, GridItem, Flex, Skeleton, Box } from 'ui';
import { BsTrash3 } from 'react-icons/bs';
import { HiShoppingCart } from 'react-icons/hi';
import { QuantityInput } from './QuantityInput';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useCart } from 'shared';

const _productListAreas = { base: '"a b b b e" "a c c d d"', sm: '"a b c d e"' };
const _productListColumns = { base: '1fr 1fr 1fr auto auto', sm: '10% 41% 22% 22% 5%' };
const _productListRows = { base: '3rem', sm: '5rem' };
const _productListPaddingY = { base: '0.5rem', sm: '0' };

export const ShoppingCartDrawer = () => {
  const router = useRouter();
  const toast = useToast();

  const onError = (error: string) => {
    if (error == 'Stock Insuficiente') {
      toast({
        title: 'No hay stock suficiente',
        status: 'error',
        duration: 3000,
        isClosable: false,
      });
    }
  };

  const {
    cart,
    isLoading,
    error,
    totalPrice,
    itemsCount,
    getCart,
    updateQuantityCart,
    deleteFromCart,
    isOpen,
    setIsOpen,
  } = useCart({ onError });

  useEffect(() => {
    getCart();
  }, []);

  const handleDelete = (itemCode: string) => {
    deleteFromCart(itemCode);
  };

  const handleQuantityChange = async (itemCode: string, quantity: number) => {
    updateQuantityCart(itemCode, quantity);
  };

  const handleClick = () => {
    router.replace('/carrito');
    setIsOpen(false);
  };

  const handleItemClick = (itemCode: string) => {
    router.push(`/productos/${itemCode}`);
    setIsOpen(false);
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        bg="transparent"
        px="0"
        borderRadius="0.5rem"
        h="100%"
        _hover={{ bg: 'primary.main' }}
      >
        <Flex
          justifyContent="center"
          alignItems="center"
          position="relative"
          w="3rem"
          h="3rem"
          pr="0.5rem"
          pt="0.375rem"
        >
          <Icon as={HiShoppingCart} w="1.75rem" h="1.75rem" color="white" />
          <Box
            position="absolute"
            top="0.25rem"
            left="1.725rem"
            bg="red.500"
            color="white"
            borderRadius="full"
            fontSize="0.75rem"
            w="1rem"
            h="1rem"
            display="flex"
            justifyContent="center"
            alignItems="center"
            zIndex="1"
          >
            {itemsCount}
          </Box>
        </Flex>
      </Button>
      <Drawer isOpen={isOpen} placement="right" onClose={() => setIsOpen(false)} size="lg">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottom="1px" borderColor="blackAlpha.200">
            <Flex alignItems="center">
              <Icon as={HiShoppingCart} w="1.375rem" h="1.375rem" mr="0.5rem" />
              MI CARRITO
              {isLoading ? (
                <Skeleton h="1rem" w="3.25rem" display="inline-block" ml="0.5rem" />
              ) : (
                <Text display="inline" fontSize="0.875rem" fontWeight="normal" ml="0.5rem">
                  {itemsCount} ITEMS
                </Text>
              )}
            </Flex>
          </DrawerHeader>
          <DrawerBody p="0">
            {itemsCount === 0 ? (
              <Flex justifyContent="center" alignItems="center" h="100%">
                <Text fontSize="1.125rem" fontWeight="bold">
                  Tu carrito está vacío
                </Text>
              </Flex>
            ) : (
              <>
                {isLoading ? (
                  <Flex justifyContent="center" alignItems="center" h="100%">
                    <Spinner />
                  </Flex>
                ) : (
                  <Grid>
                    {cart?.items?.map((product, index) => (
                      <GridItem key={index} borderBottom="1px" borderColor="blackAlpha.200" pr="1rem">
                        <Grid
                          gridTemplateAreas={_productListAreas}
                          gridTemplateRows={_productListRows}
                          gridTemplateColumns={_productListColumns}
                          justifyItems="center"
                          alignItems="center"
                          px="1rem"
                          py={_productListPaddingY}
                        >
                          <GridItem gridArea="a" cursor="pointer" onClick={() => handleItemClick(product.code)}>
                            <Image src={product.image_url} alt={product.code} w="3rem" />
                          </GridItem>
                          <GridItem
                            gridArea="b"
                            justifySelf="start"
                            minW="0"
                            w="90%"
                            mx="0.75rem"
                            cursor="pointer"
                            onClick={() => handleItemClick(product.code)}
                          >
                            <Text fontSize="0.75rem">{product.code}</Text>
                            <Text
                              fontSize="0.875rem"
                              fontWeight="bold"
                              whiteSpace="nowrap"
                              overflow="hidden"
                              textOverflow="ellipsis"
                            >
                              {product.name}
                            </Text>
                          </GridItem>
                          <GridItem gridArea="c">
                            <QuantityInput
                              initialQuantity={product.quantity}
                              onQuantityChange={quantity => handleQuantityChange(product.code, quantity)}
                              isDisabled={isLoading}
                            />
                          </GridItem>
                          <GridItem gridArea="d">
                            <Skeleton h="1.5rem" w="100%" isLoaded={!isLoading}>
                              <Text fontSize={{ base: '1rem', sm: '1.125rem' }} fontWeight="medium">
                                <Text as="span" fontSize={{ base: '0.875rem', sm: '0.925rem' }}>
                                  U$S{' '}
                                </Text>
                                {(parseFloat(product.price) * product.quantity).toFixed(2)}
                              </Text>
                            </Skeleton>
                          </GridItem>
                          <GridItem gridArea="e">
                            <IconButton
                              icon={<BsTrash3 />}
                              aria-label=""
                              bg="none"
                              borderRadius="50%"
                              onClick={() => handleDelete(product.code)}
                            />
                          </GridItem>
                        </Grid>
                      </GridItem>
                    ))}
                  </Grid>
                )}
              </>
            )}
          </DrawerBody>
          <DrawerFooter
            display="flex"
            flexDirection="column"
            alignItems="center"
            borderTop="1px"
            borderColor="blackAlpha.200"
          >
            <Flex justifyContent="center" alignItems="baseline" gap="0.5rem">
              <Text mb="0.75rem" fontWeight="bold" fontSize="1.125rem">
                Total:{' '}
              </Text>
              <Skeleton isLoaded={!isLoading} h="1.625rem">
                <Text mb="0.75rem" fontWeight="bold" fontSize="1.25rem">
                  <Text as="span" fontSize="1rem">
                    U$S{' '}
                  </Text>
                  {totalPrice?.toFixed(2)}
                </Text>
              </Skeleton>
            </Flex>
            <Button
              p="0.5rem"
              borderRadius="0.5rem"
              fontWeight="bold"
              w="100%"
              onClick={handleClick}
              colorScheme="primary"
              _hover={{ backgroundColor: '#820101' }}
              isDisabled={itemsCount === 0}
            >
              VER CARRITO
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};
