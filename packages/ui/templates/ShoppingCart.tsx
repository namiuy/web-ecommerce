import lscache from 'lscache';
import { IconButton, Spinner, useBreakpointValue } from '@chakra-ui/react';
import { Box, Text, Image, Container, Button, Grid, GridItem, Flex } from 'ui';
import { BsTrash3 } from 'react-icons/bs';
import { QuantityInput } from '../components/QuantityInput';
import { useRouter } from 'next/router';
import { isBrowser, useCart, getProduct } from 'shared';
import { useEffect } from 'react';

const _currencySymbol = getProduct()?.currencySymbol || 'U$S';

const _containerW = { base: '90%', lg: '75%' };
const _mainGridTemplateAreas = { base: '"a" "b"', lg: '"a b"' };
const _mainGridTemplateColumns = { base: '1fr', lg: '4fr 1fr' };
const _mainGridGap = { base: '3rem', lg: '1.5rem' };
const _productListAreas = { base: '"a b b b" "a c d e"', sm: '"a b c d e"' };
const _productListColumns = { base: '1fr 1fr 1fr auto', sm: '10% 35% 20% 30% 5%' };
const _productListRows = { base: '3rem', sm: '5rem' };
const _productListPaddingY = { base: '0.5rem', sm: '0' };
const _productListSubtotal = { base: '0.913rem', sm: '1rem' };
const _productListSubtotalUSD = { base: '0.75rem', sm: '0.875rem' };

export const ShoppingCart = () => {
  const sm = useBreakpointValue({ base: false, sm: true });
  const issBrowser = isBrowser();
  const router = useRouter();

  useEffect(() => {
    if (issBrowser) {
      const user = lscache.get('user'); // TODO: improve this
      if (!user || !user.id) {
        router.push('/');
      }
    }
  }, [issBrowser]);

  const { cart, isLoading, error, totalPrice, updateQuantityCart, deleteFromCart } = useCart({});

  const handleDelete = (itemCode: string) => {
    deleteFromCart(itemCode);
  };

  const handleQuantityChange = async (itemCode: string, quantity: number) => {
    updateQuantityCart(itemCode, quantity);
  };

  const handleItemClick = (itemCode: string) => {
    router.push(`/productos/${itemCode}`);
  };

  return (
    <Box py="1.5rem" bg="blackAlpha.100" minH="100vh">
      <Container maxW={_containerW} p="1rem 0 1.5rem 0">
        <Text fontWeight="extrabold" fontSize="1.5rem">
          MI CARRITO
        </Text>
      </Container>
      {cart?.items ? (
        <Container maxW={_containerW} px="0">
          <Grid
            gridTemplateAreas={_mainGridTemplateAreas}
            gridTemplateColumns={_mainGridTemplateColumns}
            gap={_mainGridGap}
          >
            <GridItem gridArea="a">
              <Box boxShadow="base" borderRadius="1rem" bg="white">
                <Grid>
                  {sm && (
                    <GridItem>
                      <Grid
                        gridTemplateColumns={'45% 20% 30% 5%'}
                        justifyItems="center"
                        alignItems="center"
                        fontWeight="bold"
                        py="0.5rem"
                        px="1rem"
                        borderBottom="1px"
                        borderColor="blackAlpha.200"
                      >
                        <GridItem>
                          <Text>PRODUCTO</Text>
                        </GridItem>
                        <GridItem>
                          <Text>CANTIDAD</Text>
                        </GridItem>
                        <GridItem>
                          <Text>SUBTOTAL</Text>
                        </GridItem>
                        <GridItem>
                          <Text>&nbsp;</Text>
                        </GridItem>
                      </Grid>
                    </GridItem>
                  )}
                  {cart.items.map((product, index) => (
                    <GridItem key={index} borderBottom="1px" borderColor="blackAlpha.200">
                      {isLoading ? (
                        <Flex justifyContent="center" alignItems="center" h="5rem">
                          <Spinner />
                        </Flex>
                      ) : (
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
                            />
                          </GridItem>
                          <GridItem gridArea="d">
                            <Text fontSize={_productListSubtotal}>
                              <Text as="span" fontSize={_productListSubtotalUSD}>
                                {_currencySymbol}{' '}
                              </Text>{' '}
                              {(parseFloat(product.price) * product.quantity).toFixed(2)}
                            </Text>
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
                      )}
                    </GridItem>
                  ))}
                </Grid>
              </Box>
            </GridItem>
            <GridItem gridArea="b">
              <Box p="1.5rem" pt="1rem" boxShadow="base" borderRadius="1rem" bg="white">
                <Grid gridTemplateAreas='"a" "b" "c" "d"' gap="1rem" textAlign="center">
                  <GridItem gridArea="a" justifySelf="start" fontSize="1.25rem" fontWeight="bold">
                    Resumen del pedido
                  </GridItem>
                  <GridItem gridArea="b" display="flex" justifyContent="space-between" alignItems="center">
                    <Text fontSize="1.125rem">Subtotal</Text>
                    <Box>
                      {' '}
                      <Text fontSize="1.375rem" display="inline-block">
                        <Text as="span" fontSize="1.125rem">
                          {_currencySymbol}{' '}
                        </Text>
                        {totalPrice}{' '}
                      </Text>
                      <Text
                        display="inline-block"
                        fontSize="0.688rem"
                        fontWeight="normal"
                        width="1.25rem"
                        lineHeight="0.563rem"
                        ml="0.25rem"
                      >
                        IVA inc
                      </Text>
                    </Box>
                  </GridItem>
                  <GridItem gridArea="c" w="100%">
                    <Button
                      variant="outline"
                      w="100%"
                      bg="secondary.main"
                      color="white"
                      _hover={{ backgroundColor: 'primary.main' }}
                      onClick={() => router.replace('/checkout')}
                    >
                      FINALIZAR COMPRA
                    </Button>
                  </GridItem>
                  <GridItem gridArea="d" w="100%">
                    <Button
                      variant="outline"
                      w="100%"
                      bg="white"
                      color="secondary.main"
                      borderColor="secondary.main"
                      border="2px"
                      _hover={{ backgroundColor: 'primary.main', color: 'white', borderColor: 'primary.main' }}
                      onClick={() => router.replace('/')}
                    >
                      CONTINUAR COMPRANDO
                    </Button>
                  </GridItem>
                </Grid>
              </Box>
            </GridItem>
          </Grid>
        </Container>
      ) : (
        <Container
          maxW={_containerW}
          px="0"
          my="2.5rem"
          boxShadow="base"
          borderRadius="1rem"
          bg="white"
          minH="13rem"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Text fontSize="1.25rem">Su carrito está vacío</Text>
        </Container>
      )}
    </Box>
  );
};
