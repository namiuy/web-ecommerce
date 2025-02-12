import { Box, Text, Grid, GridItem, Image } from 'ui';
import { shippingMethods, paymentMethods, useCart } from 'shared';

const _productListAreas = { base: '"a b b b" "a c d d"', sm: '"a b c d"' };
const _productListColumns = { base: '1fr 1fr 1fr auto', sm: '10% 50% 20% 20%' };
const _productListRows = { base: '3rem', sm: '5rem' };
const _productListPaddingY = { base: '0.5rem', sm: '0' };
const _productListSubtotal = { base: '0.913rem', sm: '1.125rem' };
const _productListSubtotalUSD = { base: '0.75rem', sm: '0.875rem' };

type VerificationProps = {
  shippingMethod: string;
  paymentMethod: string;
};

export const Verification = ({ shippingMethod, paymentMethod }: VerificationProps) => {
  const { cart } = useCart({});

  return (
    <>
      <Text fontWeight="semibold" fontSize="1.25rem" p="1rem" pt="0.25rem">
        Revisa y confirma tu compra
      </Text>
      <Box px="1.5rem" pb="1.5rem" borderBottom="1px" borderColor="blackAlpha.200">
        <Text fontWeight="semibold" fontSize="1.25rem" color="blackAlpha.800" pb="0.5rem">
          Método de envío
        </Text>
        <Text fontWeight="medium" fontSize="1.125rem">
          {shippingMethods.find(method => method.id === shippingMethod)?.name}
        </Text>
        <Text>{shippingMethods.find(method => method.id === shippingMethod)?.description}</Text>
      </Box>
      <Box p="1.5rem" borderBottom="1px" borderColor="blackAlpha.200">
        <Text fontWeight="semibold" fontSize="1.25rem" color="blackAlpha.800" pb="0.5rem">
          Método de pago
        </Text>
        <Text fontWeight="medium" fontSize="1.125rem">
          {paymentMethods.find(method => method.id === paymentMethod)?.name}
        </Text>
        <Text>{paymentMethods.find(method => method.id === paymentMethod)?.description}</Text>
      </Box>
      <Box px="1.5rem" pt="1.5rem">
        <Text fontWeight="semibold" fontSize="1.25rem" color="blackAlpha.800">
          Productos
        </Text>
        {cart?.items?.map((product, index) => (
          <Box key={index} borderBottom="1px" borderColor="blackAlpha.200">
            <Grid
              gridTemplateAreas={_productListAreas}
              gridTemplateRows={_productListRows}
              gridTemplateColumns={_productListColumns}
              justifyItems="center"
              alignItems="center"
              px="1rem"
              py={_productListPaddingY}
            >
              <GridItem gridArea="a">
                <Image src={product.image_url} alt={product.code} w="3rem" />
              </GridItem>
              <GridItem gridArea="b" justifySelf="start" minW="0" w="90%" mx="0.75rem">
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
                <Text fontWeight="semibold">{product.quantity}</Text>
              </GridItem>
              <GridItem gridArea="d">
                <Text fontSize={_productListSubtotal} fontWeight="medium">
                  <Text as="span" fontSize={_productListSubtotalUSD}>
                    U$S{' '}
                  </Text>{' '}
                  {(parseFloat(product.price) * product.quantity).toFixed(2)}
                </Text>
              </GridItem>
            </Grid>
          </Box>
        ))}
      </Box>
    </>
  );
};
