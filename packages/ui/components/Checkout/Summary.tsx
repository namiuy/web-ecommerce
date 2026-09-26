import { Spinner } from '@chakra-ui/react';
import { useCart, getProduct } from 'shared';
import { Box, Text, Flex, Button, Grid, GridItem, Skeleton } from 'ui';
import { useEffect, useRef, useState } from 'react';
import getConfig from 'next/config';

const _cs = getProduct()?.currencySymbol || 'U$S';

type SummaryProps = {
  page: number;
  totalAmount: number;
  shippingPrice: number;
  handleCheckout: () => void;
  isLoading: boolean;
  paymentMethod?: string;
};

export const Summary = ({
  page,
  totalAmount,
  shippingPrice,
  handleCheckout,
  isLoading: isLoadingCheckout,
  paymentMethod,
}: SummaryProps) => {
  const { isLoading, error, totalPrice } = useCart({});
  const paypalRef = useRef<HTMLDivElement>(null);
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const isPayPal = paymentMethod === 'PAYPAL' && page === 4;

  const { publicRuntimeConfig } = getConfig() || {};
  const paypalClientId = publicRuntimeConfig?.paypalClientId || '';
  const apiBaseUrl = publicRuntimeConfig?.apiBaseUrl || '';

  useEffect(() => {
    if (!isPayPal || !paypalClientId || paypalLoaded) return;

    // Load PayPal SDK
    const existingScript = document.getElementById('paypal-sdk');
    if (existingScript) {
      setPaypalLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.id = 'paypal-sdk';
    script.src = `https://www.paypal.com/sdk/js?client-id=${paypalClientId}&currency=USD`;
    script.onload = () => setPaypalLoaded(true);
    document.body.appendChild(script);
  }, [isPayPal, paypalClientId]);

  useEffect(() => {
    if (!isPayPal || !paypalLoaded || !paypalRef.current) return;
    if (paypalRef.current.childNodes.length > 0) return; // Already rendered

    const w = window as any;
    if (!w.paypal) return;

    w.paypal.Buttons({
      createOrder: async () => {
        const res = await fetch(`${apiBaseUrl || ''}/api/paypal/create-order`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: totalAmount.toFixed(2),
            currency: 'USD',
            description: 'Compra en Robotec',
          }),
        });
        const data = await res.json();
        if (!data.id) throw new Error(data.detail || 'Error al crear orden PayPal');
        return data.id;
      },
      onApprove: async (data: any) => {
        const res = await fetch(`${apiBaseUrl || ''}/api/paypal/capture-order/${data.orderID}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
        const captureData = await res.json();
        if (captureData.status === 'COMPLETED') {
          handleCheckout();
        } else {
          alert('Error al procesar el pago con PayPal');
        }
      },
      onError: (err: any) => {
        console.error('PayPal error:', err);
        alert('Error al procesar el pago con PayPal');
      },
    }).render(paypalRef.current);
  }, [isPayPal, paypalLoaded, totalAmount]);

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
          {isPayPal ? (
            <Box ref={paypalRef} w="100%" minH="50px">
              {!paypalLoaded && <Spinner size="sm" />}
            </Box>
          ) : (
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
          )}
        </GridItem>
      </Grid>
    </Box>
  );
};
