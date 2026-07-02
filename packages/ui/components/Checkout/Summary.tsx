import { Spinner } from '@chakra-ui/react';
import { useCart, getProduct } from 'shared';
import { Box, Text, Flex, Button, Grid, GridItem, Skeleton } from 'ui';

const _cs = getProduct()?.currencySymbol || 'U$S';

type SummaryProps = {
  page: number;
  totalAmount: number;
  shippingPrice: number;
  handleCheckout: () => void;
  isLoading: boolean;
};

export const Summary = ({
  page,
  totalAmount,
  shippingPrice,
  handleCheckout,
  isLoading: isLoadingCheckout,
}: SummaryProps) => {
  const { isLoading, error, totalPrice } = useCart({});

  return (
    <Box p="1.5rem" pt="1rem" boxShadow="base" borderRadius="1rem" bg="white">
      <Grid gridTemplateAreas='"a" "b" "c" "d" "e"' gap="1rem" textAlign="center">
        <GridItem gridArea="a" justifySelf="start" fontSize="1.25rem" fontWeight="bold">
          Resumen del pedido
        </GridItem>
        <GridItem gridArea="b" display="flex" justifyContent="space-between" alignItems="center">
          <Text>Envío</Text>
          <Text fontSize="1.125rem">
            <Text as="span" fontSize="0.875rem">
              {_cs}{' '}
            </Text>
            {shippingPrice ? shippingPrice.toFixed(2) : '0'}{' '}
          </Text>
        </GridItem>
        <GridItem gridArea="c" display="flex" justifyContent="space-between" alignItems="center">
          <Text>Productos</Text>
          <Flex alignItems="baseline" gap="0.25rem" fontSize="1.125rem">
            <Text fontSize="0.875rem">{_cs} </Text>
            {isLoading ? <Skeleton w="4rem" h="1.25rem" /> : totalPrice.toFixed(2)}
          </Flex>
        </GridItem>
        <GridItem gridArea="d" display="flex" justifyContent="space-between" alignItems="center">
          <Text fontSize="1.125rem">Total</Text>
          <Box>
            <Flex alignItems="baseline" gap="0.25rem" fontSize="1.375rem">
              <Text as="span" fontSize="1.125rem">
                {_cs}{' '}
              </Text>
              {isLoading ? <Skeleton w="5rem" h="1.75rem" /> : totalAmount.toFixed(2)}
              <Text fontSize="0.75rem">IVA inc</Text>
            </Flex>
          </Box>
        </GridItem>
        <GridItem gridArea="e" w="100%">
          <Button
            variant="outline"
            w="100%"
            bg="primary.main"
            color="white"
            _hover={{ backgroundColor: 'secondary.main' }}
            isDisabled={page !== 4 || isLoadingCheckout}
            onClick={handleCheckout}
          >
            {isLoadingCheckout ? <Spinner size="sm" /> : 'FINALIZAR COMPRA'}
          </Button>
        </GridItem>
      </Grid>
    </Box>
  );
};
