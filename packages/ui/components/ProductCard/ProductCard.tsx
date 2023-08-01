import { Box, Card, Flex, Image, Link } from '@chakra-ui/react';
import { FC } from 'react';
import { Product } from 'shared/entities/product';
import { Text, Skeleton } from 'ui';

const _borderRadious = 'brand.card.borderRadious';
const _borderColor = 'brand.card.borderColor';
const _black = 'black';
const _grey0 = 'brand.grey.0';
const _grey2 = 'brand.grey.2';

const _minW = '8rem';
const _minMinH = undefined;
const _minImageMinH = '6rem';
const _minImageP = '0';
const _minCategorySize = '0.625rem';
const _minNameSize = '0.875rem';
const _minNameHeight = '1.75rem';
const _minPriceSize = '0.75rem';
const _minBodyM = '0 1rem 1rem 1rem';
const _minBodyGap = '0';

const _w = { base: '8rem', lg: '12rem' };
const _minH = { base: '14rem', lg: '18rem' };
const _imageMinH = { base: '8rem', lg: '9rem' };
const _imageP = { base: '0 0 1rem', lg: '0' };
const _categorySize = { base: '0.625rem', lg: '0.75rem' };
const _nameSize = { base: '0.875rem', lg: '1.375rem' };
const _nameHeight = { base: '1.75rem', lg: '2.75rem' };
const _priceSize = { base: '0.75rem', lg: '0.875rem' };
const _bodyM = { base: '0 1rem 1rem 1rem', lg: '1rem' };
const _bodyGap = '.25rem';

export type ProductCardProps = {
  min?: boolean;
  isLoading?: boolean;
  product?: Product;
};

export const ProductCard: FC<ProductCardProps> = ({ min = false, isLoading = false, product }) => {
  const { name, category, price, id, image_url } = product || {};
  const w = min ? _minW : _w;
  const minH = min ? _minMinH : _minH;
  const imageMinH = min ? _minImageMinH : _imageMinH;
  const imageP = min ? _minImageP : _imageP;
  const categorySize = min ? _minCategorySize : _categorySize;
  const nameSize = min ? _minNameSize : _nameSize;
  const nameHeight = min ? _minNameHeight : _nameHeight;
  const priceSize = min ? _minPriceSize : _priceSize;
  const bodyM = min ? _minBodyM : _bodyM;
  const bodyGap = min ? _minBodyGap : _bodyGap;

  return (
    <Link href={`/productos/${id}`} display="contents" _hover={{ textDecoration: 'none' }}>
      <Card
        w={w}
        minH={minH}
        borderRadius={_borderRadious}
        borderColor={_borderColor}
        boxShadow="none"
        _hover={{ boxShadow: 'md' }}
      >
        <Flex direction="column" minH={minH} justifyContent="space-between">
          <Box p={imageP}>
            {isLoading ? (
              <Skeleton w="100%" h={imageMinH} />
            ) : (
              <Image
                w="100%"
                h={imageMinH}
                alt={name}
                src={image_url}
                fit="contain"
                fallback={<Box h={imageMinH} bg={_grey0} />}
              />
            )}
          </Box>
          <Flex direction="column" justifyContent="space-between" m={bodyM} gap={bodyGap}>
            {isLoading ? (
              <>
                <Skeleton w="50%" h={categorySize} />
                <Skeleton h={nameSize} />
                <Skeleton w="40%" h={priceSize} />
              </>
            ) : (
              <>
                <Text color={_grey2} fontSize={categorySize} lineHeight={categorySize}>
                  {category?.name}
                </Text>
                <Text
                  color={_black}
                  fontSize={nameSize}
                  lineHeight={nameSize}
                  h={nameHeight}
                  fontWeight="semibold"
                  overflow="hidden"
                >
                  {name}
                </Text>
                <Text color={_black} fontSize={priceSize} lineHeight={priceSize}>
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
