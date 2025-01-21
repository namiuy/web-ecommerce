import lscache from 'lscache';
import { Spinner, useDisclosure, useToast } from '@chakra-ui/react';
import { Box, Text, Container, Button, Grid, GridItem, Flex } from 'ui';
import { useEffect, useState } from 'react';
import { useCart, paymentMethods, shippingMethods, useGetPerson } from 'shared';
import { ShippingMethod } from '../components/Checkout/ShippingMethod';
import { PaymentMethod } from '../components/Checkout/PaymentMethod';
import { Verification } from '../components/Checkout/Verification';
import { Summary } from '../components/Checkout/Summary';
import { useCheckout } from 'shared';
import { SuccessModal } from '../components/Checkout/SuccessModal';
import { Checkout as CheckoutValues } from 'shared/entities/checkout';
import { AddressSelection } from '../components/Checkout/AddressSelection';
import { Address } from 'shared/entities/address';

const _containerW = { base: '90%', lg: '75%' };
const _mainGridTemplateAreas = { base: '"a" "b"', lg: '"a b"' };
const _mainGridTemplateColumns = { base: '1fr', lg: '4fr 1fr' };
const _mainGridGap = { base: '3rem', lg: '1.5rem' };

export const Checkout = () => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const onError = (error: string) => {
    toast({
      title: error,
      status: 'error',
      duration: 3000,
      isClosable: false,
    });
  };

  const { totalPrice } = useCart({ onError });

  const [checkoutValues, setCheckoutValues] = useState<CheckoutValues>();
  const { isLoading, data, error } = useCheckout(checkoutValues);

  useEffect(() => {
    if (data) {
      onOpen();
      setCheckoutValues(undefined);
    }
  }, [data, onOpen]);

  const [shippingMethod, setShippingMethod] = useState(shippingMethods[0].id);
  const [address, setAddress] = useState<number>(0);
  const [observation, setObservation] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState(paymentMethods[0].id);
  const [shippingPrice, setShippingPrice] = useState(shippingMethods[0].price);

  const totalAmount = totalPrice + shippingPrice;

  const [page, setPage] = useState(1);
  const totalPages = 4;
  const [backButtonVisible, setBackButtonVisible] = useState(false);
  const [nextButtonVisible, setNextButtonVisible] = useState(true);

  const [addresses, setAddresses] = useState<Address[]>([]);

  const personId = lscache.get('user')?.person_id;
  const { data: person, isLoading: isLoadingPerson } = useGetPerson(personId);

  useEffect(() => {
    if (person) {
      setAddresses(person.addresses);
    }
  }, [person]);

  const handleShippingChange = (value: any) => {
    setShippingPrice(shippingMethods.find(method => method.id === value)?.price || 0);
    setShippingMethod(value);
  };

  const handleAddressChange = (value: any) => {
    setAddress(value);
  };

  const handleObservationChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setObservation(event.target.value);
  };

  const handlePaymentChange = (value: any) => {
    setPaymentMethod(value);
  };

  const handlePrevious = () => {
    if (page > 1) {
      let newPage = page - 1;

      if (page === 3 && shippingMethod == 'RES') {
        newPage--;
      }

      setPage(newPage);
      setBackButtonVisible(newPage > 1);
      setNextButtonVisible(newPage < totalPages);
    }
  };

  const handleNext = () => {
    if (page < totalPages) {
      let newPage = page + 1;

      if (page === 1 && shippingMethod == 'RES') {
        newPage++;
      }

      if (page === 2 && shippingMethod == 'INT' && !observation) {
        onError('Debes especificar la empresa de transporte');
        return;
      }

      setPage(newPage);
      setBackButtonVisible(newPage > 1);
      setNextButtonVisible(newPage < totalPages);
    }
  };

  const handleCheckout = () => {
    setCheckoutValues({
      shipping_id: shippingMethod,
      payment_id: paymentMethod,
      address_indx: address,
      observation,
    });
  };

  return (
    <Box py="1.5rem" bg="blackAlpha.100" minH="100vh">
      <Container maxW={_containerW} p="1rem 0 1.5rem 0">
        <Text fontWeight="extrabold" fontSize="1.5rem">
          FINALIZAR COMPRA
        </Text>
      </Container>
      <Container maxW={_containerW} px="0">
        <Grid
          gridTemplateAreas={_mainGridTemplateAreas}
          gridTemplateColumns={_mainGridTemplateColumns}
          gap={_mainGridGap}
        >
          <GridItem gridArea="a">
            <Box boxShadow="base" borderRadius="1rem" bg="white" p="1rem">
              {page == 1 && (
                <ShippingMethod shippingMethod={shippingMethod} handleShippingChange={handleShippingChange} />
              )}
              {page == 2 && (
                <AddressSelection
                  addresses={addresses}
                  shippingMethod={shippingMethod}
                  address={address}
                  observation={observation}
                  handleAddressChange={handleAddressChange}
                  handleObservationChange={handleObservationChange}
                />
              )}
              {page == 3 && <PaymentMethod paymentMethod={paymentMethod} handlePaymentChange={handlePaymentChange} />}
              {page == 4 && (
                <Verification
                  address={addresses[address]}
                  shippingMethod={shippingMethod}
                  paymentMethod={paymentMethod}
                  observation={observation}
                />
              )}
              <Flex justifyContent="space-between" p="1.5rem">
                {backButtonVisible ? (
                  <Button colorScheme="primary" onClick={handlePrevious}>
                    VOLVER
                  </Button>
                ) : (
                  <Box />
                )}
                {nextButtonVisible ? (
                  <Button colorScheme="primary" onClick={handleNext}>
                    SIGUIENTE
                  </Button>
                ) : (
                  <Box />
                )}
              </Flex>
            </Box>
          </GridItem>
          <GridItem gridArea="b" w={{ base: 'auto', lg: '17.5rem' }}>
            <Summary
              isLoading={isLoading}
              page={page}
              totalAmount={totalAmount}
              shippingPrice={shippingPrice}
              handleCheckout={handleCheckout}
            />
          </GridItem>
        </Grid>
      </Container>
      <SuccessModal isOpen={isOpen} onClose={onClose} />
    </Box>
  );
};
