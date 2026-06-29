/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { Link, useDisclosure, useBreakpointValue, Divider, AspectRatio, Image } from '@chakra-ui/react';
import { ChevronLeftIcon } from '@chakra-ui/icons';
import {
  Flex,
  Container,
  Grid,
  GridItem,
  Heading,
  Text,
  Box,
  Skeleton,
  ImageModal,
  Card,
  AddToCartButton,
  QuoteRequestButton,
} from 'ui';
import { WhatsAppRequestButton } from 'ui/components/WhatsAppRequestButton';
import { AutopartStock } from 'ui/components/AutopartStock';
import { useRouter } from 'next/router';
import { useAutopartGet, getCartEnabled, getProduct } from 'shared';
const cartEnabled = getCartEnabled();
const productConf = getProduct();
import { Autopart } from 'shared/entities/autopart';
import { formatPrice } from 'shared/utils/product';
import { QuantityInput } from 'ui/components/QuantityInput';
import { RelatedAutoparts } from './RelatedAutoparts';
import { Product } from 'shared/entities/product';

const { detailPriceType } = productConf;
const _detailPriceType = (detailPriceType || 'WITH_TAX').toUpperCase();

const _background = 'brand.background';
const _borderColor = 'brand.productDetail.borderColor';
const _smallTextColor = 'brand.productDetail.smallText';
const _productSale = 'brand.productDetail.sale';
const _color = 'brand.productDetail.smallText';
const _grey0 = 'brand.grey.0';

const isPriceWithTax = _detailPriceType === 'WITH_TAX';
const isPriceWithoutTax = _detailPriceType === 'WITHOUT_TAX';
const isPriceBoth = _detailPriceType === 'BOTH';
const isPriceSimple = _detailPriceType === 'SIMPLE';

const _mainBoxPaddingY = { lg: '3rem', base: '2rem' };
const _mainWidth = { lg: '75%', base: '90%' };
const _mainMaxWidth = "1500px";
const _containerPadding = { lg: '2rem', base: '1rem' };
const _gridTemplateAreas = { lg: `"image details" "description description"`, base: `"image" "details" "description"` };
const _gridTemplateRows = { lg: 'auto 1fr', base: 'auto 1fr' };
const _gridTemplateColumns = { lg: '3fr 2fr', base: '1fr' };
const _gridItemBorderColor = { lg: _borderColor, base: 'transparent' };
const _gridItemImagePaddingBottom = { lg: '0', base: '1rem' };
const _gridItemImagePaddingRight = { lg: '1.5rem', base: '0' };
const _gridItemDetailsBorderLeft = { lg: '1px', base: '0' };
const _gridIemDetailsPaddingLeft = { lg: '2rem', base: '0' };

export type AutopartActionProps = {
  isLoading: boolean;
  quantity?: number;
};

type AutopartAction = 'add_to_cart' | 'quote_request' | 'whatsapp_request';

type AutopartDetailTemplateProps = {
  id: string;
  actions: AutopartAction[];
};

const getAction = (action: AutopartAction, props: AutopartActionProps, autopart: Autopart) => {
  const product = {
    id: autopart?.id,
    path: `/productos/${autopart?.id}`,
  } as Product
  const proopsWithProduct = { ...props, product };
  if (action === 'add_to_cart') return <AddToCartButton key={action} {...proopsWithProduct} />;
  if (action === 'quote_request') return <QuoteRequestButton key={action} {...proopsWithProduct} />;
  if (action === 'whatsapp_request') return <WhatsAppRequestButton key={action} {...proopsWithProduct} />;
  return <></>;
};

const ProductStockList = ({ products }: { products: any[] }) => {
  const hasValidPrices = products.some(p => p.price && p.price > 0);

  return (
    <Box>
      <Flex justifyContent="space-between" alignItems="center">
      <Text fontSize="0.875rem" color={_color} mb="0.5rem" fontWeight="medium">
        Productos ({products.length})
      </Text>
      <Text fontSize="0.875rem" color={_color} mb="0.5rem" fontWeight="medium">
        Precios IVA inc.
      </Text>
      </Flex>
      {products.map((product, index) => (
        <Box key={index} border="1px" borderColor={_borderColor} borderRadius="md" p="1rem" mb="0.5rem" _hover={{ bg: 'gray.50' }}>
          <Flex justifyContent="space-between" alignItems="flex-start">
            <Box flex="1">
              <Text fontSize="0.75rem" color={_smallTextColor} mb="0.25rem">
                Código: {product.id}
              </Text>
              <Flex alignItems="center" gap="0.5rem">
                <Text fontSize="0.75rem" color={_smallTextColor}>
                  Stock:
                </Text>
                <AutopartStock productId={product.id} />
              </Flex>
            </Box>
            <Box textAlign="right" minW="120px" mt="0.25rem">
              {hasValidPrices && product.price > 0 ? (
                <>
                  {isPriceSimple ? (
                    // SIMPLE mode - show discount logic
                    <>
                      {product.discount && product.discount > 0 ? (
                        // With discount
                        <Box>
                          <Text fontSize="1rem" fontWeight="medium" as="s" color={_productSale}>
                            $ {formatPrice(product.price)}
                          </Text>
                          <Flex alignItems="center" gap="0.5rem" mt="0.25rem">
                            <Flex alignItems="baseline" gap="0.25rem" fontWeight="medium">
                              <Text fontSize="1.25rem">$</Text>
                              <Text fontSize="1.75rem">
                                {formatPrice(product.price - (product.price * product.discount) / 100)}
                              </Text>
                            </Flex>
                            <Box bg="green" color="white" borderRadius="0.75rem" py="0.125rem" px="0.5rem" fontWeight="bold" fontSize="0.75rem">
                              {product.discount}% OFF
                            </Box>
                          </Flex>
                        </Box>
                      ) : (
                        // No discount
                        <Flex alignItems="baseline" gap="0.25rem">
                          <Text fontSize="1rem">$</Text>
                          <Text fontSize="1.75rem" fontWeight="medium">
                            {formatPrice(product.price)}
                          </Text>
                        </Flex>
                      )}
                    </>
                  ) : isPriceWithTax ? (
                    // WITH_TAX mode - show price with "IVA inc."
                    <Box>
                      <Text fontSize="1.75rem" fontWeight="medium">
                        <Text as="span" fontSize="1.25rem">$ </Text>
                        {formatPrice(product.price)}
                        {/* <Text as="span" color={_smallTextColor} fontSize="0.75rem"> IVA inc.</Text> */}
                      </Text>
                    </Box>
                  ) : isPriceWithoutTax ? (
                    // WITHOUT_TAX mode - show price_without_tax with "+ IVA"
                    <Box>
                      <Text fontSize="1.75rem" fontWeight="medium">
                        <Text as="span" fontSize="1.25rem">$ </Text>
                        {formatPrice(product.price_without_tax)}
                        {/* <Text as="span" color={_smallTextColor} fontSize="0.75rem"> + IVA</Text> */}
                      </Text>
                    </Box>
                  ) : isPriceBoth ? (
                    // BOTH mode - show both prices
                    <Box>
                      <Text fontSize="1.75rem" fontWeight="medium">
                        <Text as="span" fontSize="1.25rem">$ </Text>
                        {formatPrice(product.price_without_tax)}
                        {/* <Text as="span" color={_smallTextColor} fontSize="0.75rem"> + IVA</Text> */}
                      </Text>
                      <Text fontSize="1rem" fontWeight="medium" color={_smallTextColor} mt="0.25rem">
                        <Text as="span" fontSize="0.875rem">$ </Text>
                        {formatPrice(product.price)}
                        {/* <Text as="span" fontSize="0.625rem"> IVA inc.</Text> */}
                      </Text>
                    </Box>
                  ) : null}
                </>
              ) : (
                <Text fontSize="0.875rem" fontWeight="medium" color="blue.600">
                  Consultar precio
                </Text>
              )}
            </Box>
          </Flex>
        </Box>
      ))}
    </Box>
  );
};

const Applications = ({ applications }: { applications: any[] }) => {
  if (!applications || applications.length === 0) return null;

  const hasYearRange = applications.some(app => app.year_range && app.year_range !== '' && app.year_range.toLowerCase() !== 'n/d');

  return (
    <>
      <Divider mb="3.5rem" />
      <Box mb="3.5rem">
        <Container w={_mainWidth} maxW={_mainMaxWidth} px="0" mb="1.5rem">
          <Heading as="h4" size="lg">APLICACIONES</Heading>
        </Container>
        <Card w={_mainWidth} maxW={_mainMaxWidth} mx="auto">
          <Box>
            {applications.map((app, i) => (
              <Box key={i}>
                {i !== 0 && <Divider />}
                <Flex py="0.75rem" pl="1rem" flexDir={{ base: 'column', md: 'row' }}>
                  <Text w={{ base: '100%', md: '25%' }} pb={{ base: '0.25rem', md: '0' }} fontWeight="medium">
                    {app.brand?.name}
                  </Text>
                  {hasYearRange && (
                    <Text w={{ base: '100%', md: '20%' }} pb={{ base: '0.25rem', md: '0' }}>
                      {app.year_range}
                    </Text>
                  )}
                  <Text w={{ base: '100%', md: hasYearRange ? '55%' : '75%' }}>
                    {app.name}
                  </Text>
                </Flex>
              </Box>
            ))}
          </Box>
        </Card>
      </Box>
    </>
  );
};

const Dimensions = ({ products }: { products: any[] }) => {
  if (!products || products.length === 0) return null;

  const firstProduct = products[0];
  const specs = firstProduct.specifications || [];

  const height = specs.find((s: any) => s.name === 'Alto')?.value;
  const width = specs.find((s: any) => s.name === 'Ancho')?.value;
  const system = specs.find((s: any) => s.name === 'Sistema')?.value;

  if (!height && !width && !system) return null;

  return (
    <>
      <Divider mb="3.5rem" />
      <Box mb="3.5rem">
        <Container w={_mainWidth} maxW={_mainMaxWidth} px="0" mb="1.5rem">
          <Heading as="h4" size="lg">MEDIDAS</Heading>
        </Container>
        <Card w={_mainWidth} maxW={_mainMaxWidth} mx="auto">
          <Box p="2rem" textAlign="center">
            <Box mb="1rem">
              <Text fontSize="2rem">📐</Text>
            </Box>
            {height && (
              <Text mb="0.5rem">
                <Text as="span" fontWeight="medium">Alto:</Text> {height}
              </Text>
            )}
            {width && (
              <Text mb="0.5rem">
                <Text as="span" fontWeight="medium">Ancho:</Text> {width}
              </Text>
            )}
            {system && (
              <Text>
                <Text as="span" fontWeight="medium">Sistema:</Text> {system}
              </Text>
            )}
          </Box>
        </Card>
      </Box>
    </>
  );
};

export const AutopartDetailTemplate = ({ id, actions = [] }: AutopartDetailTemplateProps) => {
  const router = useRouter();
  const imageDisclosure = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, sm: false });

  const { isLoading, error, data } = useAutopartGet(id);

  const [quantity, setQuantity] = useState(1);
  const [mainImageUrl, setMainImageUrl] = useState<string>('');

  const shouldUseMultimedias = data?.multimedias !== undefined && data?.multimedias?.length > 0;


  const getMainImage = (): string => {
    if (shouldUseMultimedias) {
      const firstPhoto = data?.multimedias?.find(m => m.type === 'photo' && m.url);
      return firstPhoto?.url || '';
    }
    return data?.image_url || '';
  };

  useEffect(() => {
    const mainImg = getMainImage();
    setMainImageUrl(mainImg);
  }, [data, shouldUseMultimedias]);

  if (error) {
    console.log(error);
    return <></>;
  }

  const applicationName = (data?.applications?.[0] as any)?.name || data?.applications?.[0]?.model || data?.description || '';

  return (
    <Box bg={_background} py={_mainBoxPaddingY} minH="100vh">
      <Container w={_mainWidth} maxW={_mainMaxWidth} px="0" mb="0.5rem">
        <Flex align="center">
          <Link
            onClick={() => router.back()}
            display="inline-flex"
            alignItems="center"
            color="blue.600"
            fontSize="sm"
            fontWeight="medium"
            _hover={{ textDecoration: 'none', color: 'blue.700' }}
            cursor="pointer"
          >
            <ChevronLeftIcon boxSize={5} />
            Volver a resultados
          </Link>
        </Flex>
      </Container>
      <Card w={_mainWidth} maxW={_mainMaxWidth} p={_containerPadding} m="0.5rem auto 3.5rem auto">
        <Grid
          templateAreas={_gridTemplateAreas}
          templateRows={_gridTemplateRows}
          templateColumns={_gridTemplateColumns}
        >
          <GridItem
            w="100%"
            area="image"
            placeSelf="center"
            pb={_gridItemImagePaddingBottom}
            pr={_gridItemImagePaddingRight}
          >
            <Skeleton isLoaded={!isLoading}>
              <AspectRatio ratio={{ base: 4 / 3, lg: 1, xl: 4 / 3 }}>
                {shouldUseMultimedias && data?.multimedias?.find(m => m.type === 'video' && m.url === mainImageUrl) ? (
                  <video src={mainImageUrl} controls style={{ width: '100%', height: '100%', objectFit: 'contain' }}>
                    Tu navegador no soporta el elemento de video.
                  </video>
                ) : mainImageUrl ? (
                  <Image
                    w="100%"
                    onClick={imageDisclosure.onOpen}
                    src={mainImageUrl}
                    alt={data?.description || applicationName}
                    cursor="pointer"
                    style={{ objectFit: 'contain' }}
                    fallback={<Box w="100%" h="100%" bg={_grey0} />}
                  />
                ) : (
                  <Flex w="100%" h="100%" bg={_grey0} alignItems="center" justifyContent="center" borderRadius="md">
                    <Text fontSize="4rem" color="gray.400">
                      {data?.category?.name === 'Radiador' ? '\u2744' :
                       data?.category?.name === 'Compresor' ? '\u2699' :
                       data?.category?.name === 'Condensador' ? '\u2744' :
                       '\uD83D\uDD27'}
                    </Text>
                  </Flex>
                )}
              </AspectRatio>

              <Flex gap="1.25rem" mt="0.5rem" wrap="wrap">
                {shouldUseMultimedias
                  ? data?.multimedias?.map((media, index) => {
                      if (!media.url) return null;
                      const isSelected = media.url === mainImageUrl;

                      return (
                        <Box
                          key={index}
                          border={isSelected ? '2px solid' : '1px solid'}
                          borderColor={isSelected ? 'blue.500' : 'gray.300'}
                          borderRadius="md"
                          boxSize="4rem"
                          overflow="hidden"
                          p="0.25rem"
                          _hover={{ cursor: 'pointer', opacity: 0.8 }}
                          onClick={() => setMainImageUrl(media.url!)}
                          position="relative"
                        >
                          {media.type === 'photo' ? (
                            <Image src={media.url} alt={`thumb-${index}`} boxSize="100%" objectFit="contain" />
                          ) : (
                            <Box
                              boxSize="100%"
                              bg="gray.100"
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                              borderRadius="sm"
                            >
                              <Text fontSize="lg">📹</Text>
                            </Box>
                          )}
                        </Box>
                      );
                    })
                  : null}
              </Flex>
              <ImageModal
                disclosure={imageDisclosure}
                image={mainImageUrl}
                title={applicationName}
                isMobile={!!isMobile}
              />
            </Skeleton>
          </GridItem>
          <GridItem
            area="details"
            pl={_gridIemDetailsPaddingLeft}
            borderLeft={_gridItemDetailsBorderLeft}
            borderColor={_gridItemBorderColor}
          >
            <Box borderBottom="1px" borderColor={_borderColor} pb="1rem" mb="1rem">
              {isLoading ? (
                <Skeleton w="25%" h="1.5rem" mb="0.5rem" />
              ) : (
                <Box>
                  <Link
                    href={`/autopartes?b=${data?.brand?.id}`}
                    _hover={{ textDecoration: 'none' }}
                    fontSize="0.875rem"
                    color={_smallTextColor}
                  >
                    {data?.brand?.name}
                  </Link>
                </Box>
              )}
              {isLoading ? (
                <Skeleton w="100%" h="5rem" mb="0.5rem" />
              ) : (
                <Box mb="0.25rem">
                  <Text fontWeight="bold" fontSize="1.5rem">
                    {data?.description || applicationName}
                  </Text>
                </Box>
              )}
              {isLoading ? (
                <Skeleton w="25%" h="1.5rem" mb="1rem" />
              ) : (
                <Box mb="0.75rem">
                  <Text color={_smallTextColor} fontSize="0.875rem">
                    <Text as="span" fontSize="0.75rem">
                      Cod{' '}
                    </Text>
                    {data?.id}
                  </Text>
                </Box>
              )}
            </Box>

            {data?.products && data.products.length > 0 && (
              <Skeleton isLoaded={!isLoading} w="100%" mb="1rem">
                <ProductStockList products={data.products} />
              </Skeleton>
            )}

            {cartEnabled && (
              <Skeleton isLoaded={!isLoading} w="fit-content" mb="1rem">
                <Flex alignItems="center" gap="1rem" mb="1.5rem">
                  <Text fontSize="0.875rem" color={_color}>
                    Cantidad
                  </Text>
                  <QuantityInput initialQuantity={1} onQuantityChange={value => setQuantity(value)} />
                </Flex>
              </Skeleton>
            )}

            <>
              {actions.map(action =>
                getAction(action, {
                  isLoading,
                  quantity,
                }, data as Autopart),
              )}
            </>
          </GridItem>
        </Grid>
      </Card>
      
      {!!data?.applications?.length && (
        <Applications applications={data.applications} />
      )}
      {!!data?.products?.length && (
        <Dimensions products={data.products} />
      )}
      {data && (
        <RelatedAutoparts autopart={data} />
      )}
    </Box>
  );
};
