import { Box, Card, Flex, Image, Link } from '@chakra-ui/react';
import { Product } from 'shared/entities/product';
import { Text, Skeleton } from 'ui';

const _borderRadious = 'brand.card.borderRadious';
const _borderColor = 'brand.card.borderColor';
const _black = 'black';
const _grey2 = 'brand.grey.2';

const _maxW = { base: '12rem', lg: '13rem' };
const _minH = { base: '14rem', lg: '18rem' };
const _imageMinH = { base: '8rem', lg: '9rem' };
const _imageP = { base: '0 0 1rem', lg: '1rem 0' };
const _categorySize = { base: '0.625rem', lg: '0.75rem' };
const _nameSize = { base: '0.875rem', lg: '1.375rem' };
const _nameHeight = { base: '1.75rem', lg: '2.75rem' };
const _priceSize = { base: '0.75rem', lg: '0.875rem' };
const _bodyM = { base: '0 1rem 1rem 1rem', lg: '1rem' };
const _bodyGap = '.25rem';

type ProductCardProps = {
  isLoading?: boolean;
  product?: Product;
};

export const ProductCard = ({ isLoading = false, product }: ProductCardProps) => {
  const { name, category, price, path, image_url } = product || {};
  return (
    <Link href="/" /*href={path}*/ _hover={{ textDecoration: 'none' }}>
      <Card
        maxW={_maxW}
        minH={_minH}
        borderRadius={_borderRadious}
        borderColor={_borderColor}
        boxShadow="none"
        _hover={{ boxShadow: 'md' }}
      >
        <Flex direction="column" minH={_minH} justifyContent="space-between">
          <Box p={_imageP}>
            {isLoading ? (
              <Skeleton w="100%" h={_imageMinH} />
            ) : (
              <Image w="100%" h={_imageMinH} alt={name} src={image_url} fit="contain" />
            )}
          </Box>
          <Flex direction="column" justifyContent="space-between" m={_bodyM} gap={_bodyGap}>
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
                <Text color={_black} fontSize={_priceSize} lineHeight={_priceSize}>
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
