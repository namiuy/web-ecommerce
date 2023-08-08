import { Icon, Skeleton } from '@chakra-ui/react';
import { Button } from 'ui';
import { BiSolidShoppingBag } from 'react-icons/bi';
import { FC } from 'react';
import { ProductActionProps } from '../templates/ProductDetail';

const _gridItemDetailsBuyButtonColors = { bg: 'red.500', color: 'white', _hover: { bg: 'red.700' } };

const _shoppingBagIcon = { ml: '5px', boxSize: 4, mb: '3px' };

export const AddToCartButton: FC<ProductActionProps> = ({ isLoading, product }) =>
  isLoading ? (
    <Skeleton w="100%" h="2.5rem" />
  ) : (
    <Button width="100%" sx={_gridItemDetailsBuyButtonColors} isDisabled={!product || product?.stock !== 'AV'}>
      COMPRAR <Icon as={BiSolidShoppingBag} sx={_shoppingBagIcon} />
    </Button>
  );
