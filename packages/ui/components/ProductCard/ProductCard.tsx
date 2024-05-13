import { Box, Flex, Image, Link } from '@chakra-ui/react';
import { Product } from 'shared/entities/product';
import { Card, Text, Skeleton } from 'ui';
import { boxShadowMd } from '../ThemeProvider/colors';
import { formatPrice } from 'shared/utils/product';

import { product as productConf } from 'shared';
const { showCod, cardPriceType } = productConf;

const _black = 'black';
const _grey0 = 'brand.grey.0';
const _grey2 = 'brand.grey.2';
const _smallTextColor = 'brand.productDetail.smallText';

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
const _priceSize = { base: '0.875rem', lg: '1.25rem' };
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
  const { name, category, price, price_without_tax, id, image_url } = product || {};
  return (
    <Link href={`/productos/${id}`} display="contents" _hover={{ textDecoration: 'none' }}>
      <Card minW={_minW} maxW={_maxW} mt={_mt} p={_p} size="sm" _hover={{ boxShadow: boxShadowMd }}>
        <Flex direction="column" justifyContent="space-between">
          <Box mb={_imageMb}>
            {isLoading ? (
              <Skeleton w="100%" h={_imageMinH} />
            ) : (
              <Image
                w="100%"
                h={_imageMinH}
                alt={name}
                src={image_url}
                fit="contain"
                fallback={<Box h={_imageMinH} bg={_grey0} />}
              />
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
                      '-webkit-box-orient': 'vertical',
                      '-webkit-line-clamp': '1',
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
                      '-webkit-box-orient': 'vertical',
                      '-webkit-line-clamp': '2',
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
                        '-webkit-box-orient': 'vertical',
                        '-webkit-line-clamp': '1',
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

                <Text color={_black} fontSize={_priceSize} lineHeight={_priceSize} fontWeight="bold">
                  <Text as="span" fontSize="1rem">
                    U$S{' '}
                  </Text>
                  {isPriceSimple ? (
                    <>{formatPrice(price)}</>
                  ) : isPriceWithTax ? (
                    <>
                      {formatPrice(price)}
                      <Text as="span" color={_smallTextColor} fontSize="0.875rem">
                        {' '}
                        IVA inc.
                      </Text>
                    </>
                  ) : (
                    <>
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
      </Card>
    </Link>
  );
};

//  TODO: button add to wish list
