import { Spinner } from '@chakra-ui/react';
import { useCart } from 'shared';
import { Box, Text, Flex, Button, Grid, GridItem } from 'ui';

type SummaryProps = {
  page: number;
  totalAmount: number;
  shippingPrice: number;
};

export const Summary = ({ page, totalAmount, shippingPrice }: SummaryProps) => {
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
              U$S{' '}
            </Text>
            {shippingPrice ? shippingPrice.toFixed(2) : '0'}{' '}
          </Text>
        </GridItem>
        <GridItem gridArea="c" display="flex" justifyContent="space-between" alignItems="center">
          <Text>Productos</Text>
          <Flex alignItems="baseline" gap="0.25rem" fontSize="1.125rem">
            <Text fontSize="0.875rem">U$S </Text>
            {isLoading ? <Spinner /> : totalPrice.toFixed(2)}
          </Flex>
        </GridItem>
        <GridItem gridArea="d" display="flex" justifyContent="space-between" alignItems="center">
          <Text fontSize="1.125rem">Total</Text>
          <Box>
            <Flex alignItems="baseline" gap="0.25rem" fontSize="1.375rem">
              <Text as="span" fontSize="1.125rem">
                U$S{' '}
              </Text>
              {isLoading ? <Spinner /> : totalAmount.toFixed(2)}
              <Text fontSize="0.75rem">IVA inc</Text>
            </Flex>
          </Box>
        </GridItem>
        <GridItem gridArea="e" w="100%">
          <Button
            variant="outline"
            w="100%"
            bg="#6A0000"
            color="white"
            _hover={{ backgroundColor: '#820101' }}
            isDisabled={page !== 3}
          >
            FINALIZAR COMPRA
          </Button>
        </GridItem>
      </Grid>
    </Box>
  );
};
