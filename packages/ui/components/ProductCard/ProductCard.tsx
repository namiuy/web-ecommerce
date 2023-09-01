import { Box, Flex, Image, Link } from '@chakra-ui/react';
import { FC } from 'react';
import { Product } from 'shared/entities/product';
import { Card, Text, Skeleton } from 'ui';
import { boxShadowMd } from '../ThemeProvider/colors';

const _black = 'black';
const _grey0 = 'brand.grey.0';
const _grey2 = 'brand.grey.2';

const _minW = { base: '8rem', lg: '13rem' };
const _maxW = { base: '12rem', lg: '14rem' };
const _mt = { base: '1rem', lg: '1rem' };
const _p = { base: '.5rem .5rem 1rem .5rem', lg: '1rem 1rem 1.25rem 1rem' };

const _imageMinH = { base: '8rem', lg: '10rem' };
const _imageMb = { base: '.5rem', lg: '1rem' };
const _categorySize = { base: '0.625rem', lg: '0.75rem' };
const _nameSize = { base: '1rem', lg: '1.375rem' };
const _nameHeight = { base: '2rem', lg: '2.75rem' };
const _priceSize = { base: '0.875rem', lg: '1rem' };
const _bodyP = { base: '0 .5rem', lg: 0 };
const _bodyGap = '.5rem';

export type ProductCardProps = {
  min?: boolean;
  isLoading?: boolean;
  product?: Product;
};

export const ProductCard: FC<ProductCardProps> = ({ min = false, isLoading = false, product }) => {
  const { name, category, price, id, image_url } = product || {};
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
                <Text color={_grey2} fontSize={_categorySize} lineHeight={_categorySize}>
                  {category?.name}
                </Text>
                <Text
                  color={_black}
                  fontSize={_nameSize}
                  lineHeight={_nameSize}
                  h={_nameHeight}
                  fontWeight="semibold"
                  overflow="hidden"
                >
                  {name}
                </Text>
                <Text color={_black} fontSize={_priceSize} lineHeight={_priceSize} fontWeight="bold">
                  U$S {price?.toLocaleString('es-UY')}
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
