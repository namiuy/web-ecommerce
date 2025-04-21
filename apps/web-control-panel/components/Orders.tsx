import lscache from 'lscache';
import { Spinner, useBreakpointValue, Divider, Center } from '@chakra-ui/react';
import router from 'next/router';
import { useListOrders } from 'shared';
import { Box, Text, Flex, Grid, GridItem, Image } from 'ui';
import { OrderStatus } from 'ui/components/OrderStatus';
import { Status } from 'shared/entities/status';

const _productListPaddingY = { base: '0.5rem', sm: '0' };
const _productListSubtotal = { base: '0.913rem', sm: '1rem' };
const _productListSubtotalUSD = { base: '0.75rem', sm: '0.875rem' };

const _boxShadow = ' 0 3px 5px -1px rgb(0 0 0 / 5%), 0 6px 40px 0 rgb(0 0 0 / 3%), 0 1px 18px 0 rgb(0 0 0 / 2%) ';

export const Orders = () => {
  const md = useBreakpointValue({ base: false, md: true });

  const guid = lscache.get('user')?.id;
  const { data, isLoading, error } = useListOrders(guid);

  return (
    <>
      <Text fontSize="1.5rem" fontWeight="medium">
        Ordenes
      </Text>
      {false ? (
        <Flex
          justifyContent="center"
          alignItems="center"
          h="20rem"
          bg="white"
          boxShadow={_boxShadow}
          borderRadius="0.5rem"
          mt="2rem"
        >
          <Spinner size="xl" />
        </Flex>
      ) : (
        <>
          {' '}
          {data?.result_count == 0 ? (
            <Flex
              justifyContent="center"
              alignItems="center"
              h="20rem"
              bg="white"
              boxShadow={_boxShadow}
              borderRadius="0.5rem"
            >
              <Text fontSize="1.25rem">No has realizado ninguna compra.</Text>
            </Flex>
          ) : (
            <Flex direction="column" gap="1.5rem" overflow="scroll" pb="2rem">
              {data?.orders.map((order: any) => (
                <Flex
                  key={order.number}
                  bg="white"
                  p="1.5rem"
                  mx="1rem"
                  borderRadius="0.5rem"
                  boxShadow={_boxShadow}
                  flexDir="column"
                  gap="2rem"
                  pb="2rem"
                >
                  <Flex justify="space-between">
                    <Text>{new Date(order.date).toLocaleDateString('es-ES')}</Text>
                    <Text>#{order.number}</Text>
                    <OrderStatus orderId={order.id} status={order.status as Status} isEdit />
                  </Flex>
                  <Flex flexDir={{ base: 'column', md: 'row' }} gap={{ base: '1.5rem', md: '2rem' }}>
                    <Flex flexDir="column" w={{ base: '100%', md: '35%' }} gap="0.5rem">
                      <Text fontWeight="semibold">DATOS PERSONALES</Text>
                      <Flex justifyContent="space-between">
                        <Text>Nombre</Text>
                        <Text>
                          {order.person.name} {order.person.last_name}
                        </Text>
                      </Flex>
                      <Flex justifyContent="space-between">
                        <Text>Email</Text>
                        <Text>{order.user_mail}</Text>
                      </Flex>
                      <Flex justifyContent="space-between">
                        <Text>Telefono</Text>
                        <Text>{order.phone}</Text>
                      </Flex>
                    </Flex>
                    {md ? (
                      <Center height="8rem">
                        <Divider orientation="vertical" />
                      </Center>
                    ) : (
                      <Divider />
                    )}
                    <Flex flexDir="column" w={{ base: '100%', md: '43%' }} gap="0.5rem">
                      <Text fontWeight="semibold">DIRECCIÓN</Text>
                      <Flex justifyContent="space-between">
                        <Text>Departamento</Text>
                        <Text>{order.address.state_name}</Text>
                      </Flex>
                      <Flex justifyContent="space-between">
                        <Text>Ciudad</Text>
                        <Text>{order.address.city_name}</Text>
                      </Flex>
                      <Flex justifyContent="space-between">
                        <Text>Dirección</Text>
                        <Text>{order.address.address}</Text>
                      </Flex>
                    </Flex>
                    {md ? (
                      <Center height="8rem">
                        <Divider orientation="vertical" />
                      </Center>
                    ) : (
                      <Divider />
                    )}
                    <Flex flexDir="column" w={{ base: '100%', md: '22%' }} gap="0.5rem">
                      <Box>
                        <Text fontWeight="semibold">MÉTODO DE ENVÍO</Text>
                        <Text>{order.shipping.name}</Text>
                      </Box>
                      <Box>
                        <Text fontWeight="semibold">MÉTODO DE PAGO</Text>
                        <Text>{order.payment.name}</Text>
                      </Box>
                    </Flex>
                    {!md && <Divider />}
                  </Flex>

                  <Grid>
                    {md && (
                      <GridItem>
                        <Grid
                          gridTemplateColumns="50% 20% 20% 10%"
                          justifyItems="center"
                          alignItems="center"
                          fontWeight="bold"
                          py="0.5rem"
                          px="3rem"
                          borderBottom="1px"
                          borderColor="blackAlpha.200"
                        >
                          <GridItem>
                            <Text>PRODUCTO</Text>
                          </GridItem>
                          <GridItem>
                            <Text>CANTIDAD</Text>
                          </GridItem>
                          <GridItem>PRECIO</GridItem>
                          <GridItem>
                            <Text>SUBTOTAL</Text>
                          </GridItem>
                        </Grid>
                      </GridItem>
                    )}
                    {order.items.map((item: any, index: number) => (
                      <GridItem
                        key={index}
                        borderBottom="1px"
                        borderColor="blackAlpha.200"
                        pb={{ base: '1rem', md: '0' }}
                      >
                        <Grid
                          gridTemplateAreas={{ base: '"a b b b" "a c d e"', md: '"a b c d e"' }}
                          gridTemplateRows={{ base: '3rem', sm: '5rem' }}
                          gridTemplateColumns={{ base: '1.5fr 1fr 2fr 2fr', md: '8% 42% 20% 20% 10%' }}
                          justifyItems="center"
                          alignItems="center"
                          px={{ base: '0', md: '3rem' }}
                          py={_productListPaddingY}
                        >
                          <GridItem
                            gridArea="a"
                            cursor="pointer"
                            w="100%"
                            display="flex"
                            justifyContent="center"
                            onClick={() => router.push(`/productos/${item.code}`)}
                          >
                            <Image src={item.image_url} alt={item.code} w="3rem" />
                          </GridItem>
                          <GridItem
                            gridArea="b"
                            cursor="pointer"
                            w="100%"
                            display="flex"
                            justifyContent="flex-start"
                            alignItems="center"
                            onClick={() => router.push(`/productos/${item.code}`)}
                          >
                            <Box w="100%">
                              <Text fontSize="0.75rem">{item.code}</Text>
                              <Text
                                fontSize="0.875rem"
                                fontWeight="medium"
                                whiteSpace="nowrap"
                                overflow="hidden"
                                textOverflow="ellipsis"
                                maxW="25rem"
                              >
                                {item.name}
                              </Text>
                            </Box>
                          </GridItem>
                          <GridItem gridArea="c">
                            <Text>{item.quantity}</Text>
                          </GridItem>
                          <GridItem gridArea="d">
                            <Text fontSize={_productListSubtotal}>
                              <Text as="span" fontSize={_productListSubtotalUSD} fontWeight="medium">
                                U$S{' '}
                              </Text>{' '}
                              {item.price}
                            </Text>
                          </GridItem>
                          <GridItem gridArea="e">
                            <Text fontSize={_productListSubtotal}>
                              <Text as="span" fontSize={_productListSubtotalUSD} fontWeight="medium">
                                U$S{' '}
                              </Text>{' '}
                              {(Number(item.price) * Number(item.quantity)).toFixed(2)}
                            </Text>
                          </GridItem>
                        </Grid>
                      </GridItem>
                    ))}
                  </Grid>
                  <Flex justify="flex-end" pr={{ base: '1rem', md: '5rem' }} gap="1rem">
                    <Text fontWeight="semibold">TOTAL:</Text>
                    <Text fontSize={_productListSubtotal}>
                      <Text as="span" fontSize={_productListSubtotalUSD} fontWeight="medium">
                        U$S{' '}
                      </Text>{' '}
                      {order.items
                        .reduce((acc: number, item: any) => acc + Number(item.price) * Number(item.quantity), 0)
                        .toFixed(2)}
                    </Text>
                  </Flex>
                </Flex>
              ))}
            </Flex>
          )}
        </>
      )}
    </>
  );
};
