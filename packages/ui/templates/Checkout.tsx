import lscache from 'lscache';
import { useDisclosure, useToast } from '@chakra-ui/react';
import { Box, Text, Container, Button, Grid, GridItem, Flex } from 'ui';
import { useEffect, useState } from 'react';
import { useCart, usePaymentMethods, useShippingMethods, useGetPerson, isBrowser } from 'shared';
import { ShippingMethod } from '../components/Checkout/ShippingMethod';
import { PaymentMethod } from '../components/Checkout/PaymentMethod';
import { Verification } from '../components/Checkout/Verification';
import { Summary } from '../components/Checkout/Summary';
import { useCheckout } from 'shared';
import { SuccessModal } from '../components/Checkout/SuccessModal';
import { Checkout as CheckoutValues } from 'shared/entities/checkout';
import { AddressSelection } from '../components/Checkout/AddressSelection';
import { Address } from 'shared/entities/address';
import { useRouter } from 'next/router';

const _containerW = { base: '90%', lg: '75%' };
const _mainGridTemplateAreas = { base: '"a" "b"', lg: '"a b"' };
const _mainGridTemplateColumns = { base: '1fr', lg: '4fr 1fr' };
const _mainGridGap = { base: '3rem', lg: '1.5rem' };

export const Checkout = () => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const issBrowser = isBrowser();
  const router = useRouter();
  const shippingMethods = useShippingMethods();
  const paymentMethods = usePaymentMethods();

  useEffect(() => {
    if (issBrowser) {
      const user = lscache.get('user'); // TODO: improve this
      if (!user || !user.id) {
        router.push('/');
      }
    }
  }, [issBrowser]);

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

  const [shippingMethod, setShippingMethod] = useState(shippingMethods[0]?.id || '');
  const [address, setAddress] = useState<number>(0);
  const [observation, setObservation] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState(paymentMethods[0]?.id || '');
  const [shippingPrice, setShippingPrice] = useState(shippingMethods[0]?.price || 0);

  const totalAmount = totalPrice + shippingPrice;

  const [page, setPage] = useState(1);
  const totalPages = 4;
  const [backButtonVisible, setBackButtonVisible] = useState(false);
  const [nextButtonVisible, setNextButtonVisible] = useState(true);

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [refreshedPersonId, setRefreshedPersonId] = useState<string | null>(null);
  const [cachedPersonId, setCachedPersonId] = useState<string | null>(null);

  // Get cached personId only in browser
  useEffect(() => {
    if (issBrowser) {
      const user = lscache.get('user');
      setCachedPersonId(user?.personId || null);
    }
  }, [issBrowser]);

  const personId = refreshedPersonId || cachedPersonId;

  // If personId is '0', try to refresh user data from backend
  useEffect(() => {
    const refreshUserData = async () => {
      if (cachedPersonId === '0' || cachedPersonId === null) {
        try {
          const user = lscache.get('user');
          if (user?.id) {
            // Fetch fresh user data from backend
            const response = await fetch(`/api/users/${user.id}`);
            if (response.ok) {
              const userData = await response.json();
              if (userData.personId && userData.personId !== '0') {
                // Update localStorage with correct personId
                const updatedUser = { ...user, personId: userData.personId };
                lscache.set('user', updatedUser);
                setRefreshedPersonId(userData.personId);
              }
            }
          }
        } catch (error) {
          console.error('Failed to refresh user data:', error);
        }
      }
    };

    refreshUserData();
  }, [cachedPersonId]);

  const { data: person, isLoading: isLoadingPerson } = useGetPerson(personId);

  useEffect(() => {
    if (person && person.addresses) {
      setAddresses(person.addresses);
    } else {
      // If no person data, initialize with empty addresses
      setAddresses([]);
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

      if (page === 2 && shippingMethod == 'INT') {
        setObservation('');
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
      shippingId: shippingMethod,
      paymentId: paymentMethod,
      addressIdx: address,
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
              {page == 4 && addresses && (
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
