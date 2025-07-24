/* eslint-disable react-hooks/exhaustive-deps */
import { Fragment } from 'react';
import { Link, useDisclosure, useBreakpointValue, Divider, AspectRatio, Image } from '@chakra-ui/react';
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
import { WhatsAppRequestButton } from '../components/WhatsAppRequestButton';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Product } from 'shared/entities/product';
import { ProductStock } from '../components/ProductStock';
import { RelatedProducts } from '../components/RelatedProducts';
import { formatPrice } from 'shared/utils/product';
import { QuantityInput } from '../components/QuantityInput';
import { ColorSelector } from '../components/ColorSelector';

import { useProductGet, product as productConf, cartEnabled } from 'shared';
const { detailPriceType, showRelatedProducts, showStock } = productConf;

const _background = 'brand.background';
const _borderColor = 'brand.productDetail.borderColor';
const _smallTextColor = 'brand.productDetail.smallText';
const _relatedLinksLinkColor = 'brand.productDetail.relatedLinks.linkColor';
const _relatedLinksMainContainerHover = 'blue.50';
const _color = 'brand.productDetail.smallText';
const _productSale = 'brand.productDetail.sale';
const _grey0 = 'brand.grey.0';

const _mainBoxPaddingY = { lg: '3rem', base: '2rem' };
const _containerSize = { lg: '75%', base: '90%' };
const _containerPadding = { lg: '2rem', base: '1rem' };
const _gridTemplateAreas = { lg: `"image details" "description description"`, base: `"image" "details" "description"` };
const _gridTemplateRows = { lg: 'auto 1fr', base: 'auto 1fr' };
const _gridTemplateColumns = { lg: '3fr 2fr', base: '1fr' };
const _gridItemBorderColor = { lg: _borderColor, base: 'transparent' };
const _gridItemImagePaddingBottom = { lg: '0', base: '1rem' };
const _gridItemImagePaddingRight = { lg: '1.5rem', base: '0' };
const _gridItemDetailsBorderLeft = { lg: '1px', base: '0' };
const _gridIemDetailsPaddingLeft = { lg: '2rem', base: '0' };
const _descriptionMarginTop = { lg: '2rem', base: '0' };

export type ProductActionProps = {
  isLoading: boolean;
  product?: Product;
  quantity?: number;
};

type ProductAction = 'add_to_cart' | 'quote_request' | 'whatsapp_request';

type ProductDetailProps = {
  id: string;
  actions: ProductAction[];
};

const getAction = (action: ProductAction, props: ProductActionProps) => {
  if (action === 'add_to_cart') return <AddToCartButton key={action} {...props} />;
  if (action === 'quote_request') return <QuoteRequestButton key={action} {...props} />;
  if (action === 'whatsapp_request') return <WhatsAppRequestButton key={action} {...props} />;
  return <></>;
};

export const ProductDetail = ({ id, actions = [] }: ProductDetailProps) => {
  const router = useRouter();
  const imageDisclosure = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, sm: false });

  const { isLoading, error, data } = useProductGet(id);

  const [stock, setStock] = useState<'NO' | 'CO' | 'AV' | undefined>();

  const handleStockChange = (stock: string) => {
    if (stock === 'AV' || stock === 'CO' || stock === 'NO') {
      setStock(stock);
    }
  };

  const [quantity, setQuantity] = useState(1);

  const isPriceWithTax = detailPriceType === 'WITH_TAX';
  const isPriceWithoutTax = detailPriceType === 'WITHOUT_TAX';
  const isPriceBoth = detailPriceType === 'BOTH';
  const isPriceSimple = detailPriceType === 'SIMPLE';

  const shouldUseMultimedias = data?.multimedias !== undefined;

  const [mainImageUrl, setMainImageUrl] = useState<string>('');

  const getAllImages = () => {
    if (shouldUseMultimedias) {
      return data?.multimedias?.filter(m => m.type === 'photo' && m.url)?.map(m => m.url!) || [];
    } else {
      return data?.images || [];
    }
  };

  const getMainImage = (): string => {
    if (shouldUseMultimedias) {
      const firstPhoto = data?.multimedias?.find(m => m.type === 'photo' && m.url);
      return firstPhoto?.url || '';
    } else {
      return data?.images?.[0] || '';
    }
  };

  useEffect(() => {
    const mainImg = getMainImage();
    setMainImageUrl(mainImg);
  }, [data, shouldUseMultimedias]);

  if (error) {
    console.log(error);
    return <></>;
  }

  return (
    <Box bg={_background} py={_mainBoxPaddingY} minH="100vh">
      <Container maxW={_containerSize} px="0">
        {data && (
          <Flex justifyContent="space-between" alignItems="center">
            <Skeleton isLoaded={!isLoading}>
              <Box color="brand.grey.2" fontSize="0.875rem" fontWeight="medium">
                <Link onClick={() => router.back()} _hover={{ textDecoration: 'none' }}>
                  Volver
                </Link>
                <Text as="span" px="0.375rem">
                  {' '}
                  |{' '}
                </Text>
                <Link href={`/productos?c=${data?.category?.id}`} _hover={{ textDecoration: 'none' }}>
                  {' '}
                  {data?.category?.name}
                </Link>
              </Box>
            </Skeleton>
          </Flex>
        )}
      </Container>
      <Card maxW={_containerSize} p={_containerPadding} m="0.5rem auto 3.5rem auto">
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
                ) : (
                  <Image
                    w="100%"
                    onClick={imageDisclosure.onOpen}
                    src={mainImageUrl}
                    alt={data?.brand?.name}
                    cursor="pointer"
                    style={{ objectFit: 'contain' }}
                    fallback={<Box w="100%" h="100%" bg={_grey0} />}
                  />
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
                  : data?.images?.map((url, index) => {
                      const isSelected = url === mainImageUrl;

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
                          onClick={() => setMainImageUrl(url)}
                        >
                          <Image src={url} alt={`thumb-${index}`} boxSize="100%" objectFit="contain" />
                        </Box>
                      );
                    })}
              </Flex>

              <ImageModal
                disclosure={imageDisclosure}
                image={mainImageUrl}
                title={data?.brand?.name}
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
                    href={`/productos?b=${data?.brand?.id}`}
                    _hover={{ textDecoration: 'none' }}
                    fontSize="0.875rem"
                    color={_smallTextColor}
                  >
                    {' '}
                    {data?.brand?.name}
                  </Link>
                </Box>
              )}
              {isLoading ? (
                <Skeleton w="100%" h="5rem" mb="0.5rem" />
              ) : (
                <Box mb="0.25rem">
                  <Text fontWeight="bold" fontSize="1.5rem">
                    {data?.name}
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

              {isPriceSimple ? (
                <Box>
                  {isLoading ? (
                    <Skeleton w="50%" h="4rem" mb="0.25rem" />
                  ) : (
                    <>
                      {data?.discount && data?.discount > 0 ? (
                        <>
                          <Box>
                            <Text fontSize="1.375rem" fontWeight="medium" as="s" color={_productSale}>
                              U$S {formatPrice(data?.price)}
                            </Text>
                            <Flex alignItems="center" gap="0.75rem">
                              <Flex alignItems="baseline" gap="0.25rem" fontWeight="medium">
                                <Text fontSize="1.875rem">U$S</Text>
                                <Text fontSize="2.5rem">
                                  {formatPrice((data?.price || 0) - ((data?.price || 0) * (data?.discount || 0)) / 100)}
                                </Text>
                              </Flex>
                              <Box
                                bg="green"
                                color="white"
                                borderRadius="1rem"
                                py="0.25rem"
                                px="0.75rem"
                                fontWeight="bold"
                              >
                                {data?.discount}% OFF
                              </Box>
                            </Flex>
                          </Box>
                        </>
                      ) : (
                        <Flex alignItems="baseline" gap="0.75rem">
                          <Text fontSize="1.875rem">U$S</Text>
                          <Text fontSize="2.5rem" fontWeight="medium">
                            {formatPrice(data?.price)}
                          </Text>
                        </Flex>
                      )}
                    </>
                  )}
                </Box>
              ) : (
                <>
                  {(isPriceWithoutTax || isPriceBoth) && (
                    <Box>
                      {isLoading ? (
                        <Skeleton w="50%" h="4rem" mb="0.5rem" />
                      ) : (
                        <Box>
                          <Text fontSize="2.5rem" fontWeight="medium">
                            <Text as="span" fontSize="1.875rem">
                              U$S{' '}
                            </Text>
                            {formatPrice(data?.price_without_tax)}
                            <Text as="span" color={_smallTextColor} fontSize="0.875rem">
                              {' '}
                              + IVA
                            </Text>
                          </Text>
                        </Box>
                      )}
                    </Box>
                  )}

                  {(isPriceWithTax || isPriceBoth) && isLoading ? (
                    <Skeleton w="35%" h="2rem" mb="0.5rem" />
                  ) : (
                    <Box>
                      <Text
                        fontSize={isPriceWithTax ? '2.25rem' : '1.375rem'}
                        fontWeight="medium"
                        color={isPriceWithTax ? 'black' : _smallTextColor}
                      >
                        <Text as="span" fontSize={isPriceWithTax ? '1.875rem' : '1.125rem'}>
                          U$S{' '}
                        </Text>
                        {formatPrice(data?.price)}
                        <Text as="span" color={_smallTextColor} fontSize={isPriceWithTax ? '0.875rem' : '0.75rem'}>
                          {' '}
                          IVA inc.
                        </Text>
                      </Text>
                    </Box>
                  )}
                </>
              )}
              {data?.colors && data.colors.length > 0 && <ColorSelector colors={data?.colors} />}
            </Box>
            {showStock && (
              <Skeleton isLoaded={!isLoading} w="fit-content" mb="1rem">
                <ProductStock id={id} handleStockChange={handleStockChange} />
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
                  product: { ...data, stock } as Product,
                  quantity,
                }),
              )}
            </>
          </GridItem>
          {data?.description && (
            <GridItem
              area="description"
              borderTop="1px"
              borderColor={_borderColor}
              mt={_descriptionMarginTop}
              pt="2rem"
            >
              <Skeleton isLoaded={!isLoading}>
                <Text lineHeight="2rem">
                  {data?.description?.split('\n').map((linea, i) => (
                    <Fragment key={i}>
                      {linea}
                      <br />
                    </Fragment>
                  ))}
                </Text>
              </Skeleton>
            </GridItem>
          )}
        </Grid>
      </Card>

      {!!data?.specifications?.length && (
        <>
          <Divider mb="3.5rem" />
          <Box mb="3.5rem">
            <Container maxW={_containerSize} px="0" mb="1.5rem">
              <Heading size="lg">ESPECIFICACIONES</Heading>
            </Container>
            <Card maxW={_containerSize} mx="auto">
              <Skeleton isLoaded={!isLoading}>
                <Box>
                  {data.specifications.map(
                    (spec, i) =>
                      spec.name &&
                      spec.value && (
                        <Box key={i}>
                          {i !== 0 && <Divider />}
                          <Flex py="0.75rem" pl="1rem" flexDir={{ base: 'column', md: 'row' }}>
                            <Text w={{ base: '100%', md: '50%' }} pb={{ base: '0.25rem', md: '0' }} fontWeight="medium">
                              {spec.name}
                            </Text>
                            <Text w={{ base: '100%', md: '50%' }}>{spec.value}</Text>
                          </Flex>
                        </Box>
                      ),
                  )}
                </Box>
              </Skeleton>
            </Card>
          </Box>
        </>
      )}
      {!!data?.related_links?.length && (
        <>
          <Divider mb="3.5rem" />
          <Box mb="3.5rem">
            <Container maxW={_containerSize} px={0} mb="1.5rem">
              <Heading size="lg">LINKS</Heading>
            </Container>
            <Card maxW={_containerSize} mx="auto">
              <Skeleton isLoaded={!isLoading}>
                {data.related_links.map((link, i) => (
                  <Box key={i}>
                    {i != 0 && <Divider />}
                    <Link
                      href={link.url}
                      target="_blank"
                      display="block"
                      py="0.75rem"
                      pl="1rem"
                      color={_relatedLinksLinkColor}
                      _hover={{ textDecoration: 'none', bg: _relatedLinksMainContainerHover }}
                    >
                      <Box>{link.name}</Box>
                    </Link>
                  </Box>
                ))}
              </Skeleton>
            </Card>
          </Box>
        </>
      )}
      {showRelatedProducts && (
        <>
          <Divider mb="3.5rem" />
          <RelatedProducts id={id} />
        </>
      )}
    </Box>
  );
};
