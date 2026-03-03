import { Box, Flex, Image, Link, Badge } from '@chakra-ui/react';
import { Product } from 'shared/entities/product';
import { Card, Text, Skeleton } from 'ui';
import { boxShadowMd } from 'ui/components/ThemeProvider/colors';
import { formatPrice } from 'shared/utils/product';

import { product as productConf } from 'shared';
import { ProductStock } from './ProductStock';
const { showCod, cardPriceType, showStock } = productConf;

const _black = 'black';
const _grey0 = 'brand.grey.0';
const _grey2 = 'brand.grey.2';
const _smallTextColor = 'brand.productDetail.smallText';

const _productSale = 'brand.productDetail.sale';

const _minW = { base: '8rem', lg: '13rem' };
const _maxW = { base: '12rem', lg: '14rem' };
const _mt = { base: '1rem', lg: '1rem' };
const _p = { base: '.5rem .5rem 1rem .5rem', lg: '1rem 1rem 1.25rem 1rem' };

const _imageMinH = { base: '8rem', lg: '10rem' };
const _imageMb = { base: '.5rem', lg: '1rem' };
const _categorySize = { base: '0.625rem', lg: '0.75rem' };
const _nameSize = { base: '1rem', lg: '1.375rem' };
const _nameHeight = { base: '2.75rem', lg: '3.625rem' };
const _nameLineHeight = { base: '1.375rem', lg: '1.75rem' };
const _badgeSize = { base: '0.875rem', lg: '1rem' };
const _priceSize = { base: '1rem', lg: '1.25rem' };
const _previousPriceSize = { base: '0.75rem', lg: '1rem' };
const _bodyP = { base: '0 .5rem', lg: 0 };
const _bodyGap = '.5rem';

const isPriceWithTax = cardPriceType === 'WITH_TAX';
const isPriceSimple = cardPriceType === 'SIMPLE';

export type ProductCardProps = {
  min?: boolean;
  isLoading?: boolean;
  product?: Product;
};

export const ProductCard = ({ min = false, isLoading = false, product }: ProductCardProps) => {
  const {
    name,
    category,
    price = 0,
    price_without_tax,
    id,
    image_url,
    discount = 0,
    images,
    multimedias,
  } = product || {};

  const shouldUseMultimedias = multimedias !== undefined;

  const getProductMainImage = (): string => {
    if (shouldUseMultimedias) {
      const firstPhoto = multimedias?.find(m => m.type === 'photo' && m.url);
      if (firstPhoto?.url) return firstPhoto.url;
    } else {
      if (images && images.length > 0) {
        return images[0];
      }
    }

    return image_url || '';
  };

  const hasVideo = (): boolean => {
    if (shouldUseMultimedias) {
      return multimedias?.some(m => m.type === 'video') ?? false;
    }
    return false;
  };

  const mainImageUrl = getProductMainImage();
  const productHasVideo = hasVideo();

  return (
    <Link href={`/productos/${id}`} display="contents" _hover={{ textDecoration: 'none' }}>
      <Card minW={_minW} maxW={_maxW} mt={_mt} p={_p} size="sm" _hover={{ boxShadow: boxShadowMd }}>
        <Flex direction="column" justifyContent="space-between">
          <Box mb={_imageMb} position="relative">
            {isLoading ? (
              <Skeleton w="100%" h={_imageMinH} />
            ) : (
              <>
                <Image
                  w="100%"
                  h={_imageMinH}
                  alt={name}
                  src={mainImageUrl}
                  fit="contain"
                  fallback={<Box h={_imageMinH} bg={_grey0} />}
                />

                {productHasVideo && (
                  <Badge
                    position="absolute"
                    bottom="0.25rem"
                    left="0.25rem"
                    borderRadius="full"
                    px="0.375rem"
                    fontSize="0.625rem"
                    colorScheme="purple"
                    zIndex={1}
                  >
                    📹
                  </Badge>
                )}
              </>
            )}
          </Box>
          <Flex direction="column" justifyContent="space-between" p={_bodyP} gap={_bodyGap}>
            {isLoading ? (
              <>
                <Skeleton w="50%" h={_categorySize} />
                <Skeleton h={_nameSize} />
                <Skeleton w="40%" h={_priceSize} />
              </>
            ) : (
              <>
                <Box>
                  <Text
                    color={_grey2}
                    fontSize={_categorySize}
                    lineHeight={_categorySize}
                    overflow="hidden"
                    sx={{
                      WebkitBoxOrient: 'vertical',
                      WebkitLineClamp: '1',
                      display: '-webkit-box',
                    }}
                  >
                    {category?.name}
                  </Text>
                </Box>
                <Box>
                  <Text
                    color={_black}
                    fontSize={_nameSize}
                    lineHeight={_nameLineHeight}
                    h={_nameHeight}
                    fontWeight="semibold"
                    overflow="hidden"
                    sx={{
                      WebkitBoxOrient: 'vertical',
                      WebkitLineClamp: '2',
                      display: '-webkit-box',
                    }}
                  >
                    {name}
                  </Text>
                  {showCod && (
                    <Text
                      fontSize="0.75rem"
                      fontWeight="semibold"
                      color={_smallTextColor}
                      mt="0.125rem"
                      overflow="hidden"
                      sx={{
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: '1',
                        display: '-webkit-box',
                      }}
                    >
                      <Text as="span" fontSize="0.75rem" fontWeight="semibold">
                        Cod.
                      </Text>{' '}
                      {id}
                    </Text>
                  )}
                </Box>

                {product && showStock && <ProductStock id={product.id} />}

                <Text color={_black} fontSize={_priceSize} lineHeight={_priceSize} fontWeight="bold">
                  {isPriceSimple ? (
                    <>
                      {discount != 0 ? (
                        <Box>
                          <Flex alignItems="baseline" gap="0.25rem" fontWeight="semibold">
                            <Flex gap="0.25rem" alignItems="baseline">
                              <Text fontSize={_badgeSize}>U$S</Text>
                              <Text fontSize={_priceSize}>{formatPrice(price - (price * discount) / 100)}</Text>
                            </Flex>
                            <Text fontSize={_previousPriceSize} fontWeight="medium" as="s" color={_productSale}>
                              {formatPrice(price)}
                            </Text>
                          </Flex>
                        </Box>
                      ) : (
                        <Flex alignItems="baseline" gap="0.25rem">
                          <Text fontSize={_badgeSize}>U$S</Text>
                          <Text fontSize={_priceSize}>{formatPrice(price)}</Text>
                        </Flex>
                      )}
                    </>
                  ) : isPriceWithTax ? (
                    <>
                      <Text as="span" fontSize={_badgeSize}>
                        U$S{' '}
                      </Text>
                      {formatPrice(price)}
                      <Text as="span" color={_smallTextColor} fontSize="0.875rem">
                        {' '}
                        IVA inc.
                      </Text>
                    </>
                  ) : (
                    <>
                      <Text as="span" fontSize={_badgeSize}>
                        U$S{' '}
                      </Text>
                      {formatPrice(price_without_tax)}
                      <Text as="span" color={_smallTextColor} fontSize="0.875rem">
                        {' '}
                        + IVA
                      </Text>
                    </>
                  )}
                </Text>
              </>
            )}
          </Flex>
        </Flex>
        {!isLoading && discount != 0 && (
          <Flex
            justifyContent="center"
            alignItems="center"
            position="absolute"
            top="0.75rem"
            left="0"
            p="0.5rem"
            bg="green"
            color="white"
            borderRadius="0 0.5rem 0.5rem 0"
          >
            <Text textAlign="center" fontWeight="bold" lineHeight="1.125rem">
              {discount}% OFF
            </Text>
          </Flex>
        )}
      </Card>
    </Link>
  );
};
