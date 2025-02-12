import { Box, Text, Flex } from 'ui';
import { RadioGroup, Radio } from '@chakra-ui/react';
import { paymentMethods } from 'shared';

type PaymentMethodProps = {
  paymentMethod: string;
  handlePaymentChange: (value: string) => void;
};

export const PaymentMethod = ({ paymentMethod, handlePaymentChange }: PaymentMethodProps) => {
  return (
    <>
      {' '}
      <Text fontWeight="semibold" fontSize="1.25rem" p="1rem" pt="0.25rem">
        Elige el método de pago
      </Text>
      <RadioGroup onChange={handlePaymentChange} value={paymentMethod} px={{ base: '0', md: '1.5rem' }}>
        <Flex flexDir="column">
          {paymentMethods.map((method, index) => (
            <Flex
              key={index}
              justifyContent="space-between"
              alignItems="center"
              cursor="pointer"
              p="1.25rem"
              borderTop={index != 0 ? '1px' : 0}
              borderColor="blackAlpha.50"
              fontSize="1.125rem"
              _hover={{ bg: 'blackAlpha.50' }}
              onClick={() => handlePaymentChange(method.id)}
            >
              <Flex gap="1.5rem" w="100%">
                <Radio value={method.id} colorScheme="primary" size="lg" />
                <Box w="100%">
                  <Text fontWeight="medium">{method.name}</Text>
                  <Text fontSize="0.875rem">{method.description}</Text>
                </Box>
              </Flex>
            </Flex>
          ))}
        </Flex>
      </RadioGroup>
    </>
  );
};
