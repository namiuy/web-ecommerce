import { Box, Text, Flex } from 'ui';
import { RadioGroup, Radio } from '@chakra-ui/react';
import { shippingMethods } from 'shared';

type ShippingMethodProps = {
  shippingMethod: string;
  handleShippingChange: (value: string) => void;
};

export const ShippingMethod = ({ shippingMethod, handleShippingChange }: ShippingMethodProps) => {
  return (
    <>
      {' '}
      <Text fontWeight="semibold" fontSize="1.25rem" p="1rem" pt="0.25rem">
        Elige el método de envío
      </Text>
      <RadioGroup value={shippingMethod} px={{ base: '0', md: '1.5rem' }}>
        <Flex flexDir="column">
          {shippingMethods.map((method, index) => (
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
              onClick={() => handleShippingChange(method.id)}
            >
              <Flex gap="1.5rem" w="100%">
                <Radio value={method.id} colorScheme="primary" size="lg" />
                <Box w="75%">
                  <Text fontWeight="medium">{method.name}</Text>
                  <Text fontSize="0.875rem">{method.description}</Text>
                </Box>
              </Flex>
              {method.price ? (
                <Text whiteSpace="nowrap" fontWeight="medium">
                  <Text as="span" fontSize="0.75rem">
                    U$S{' '}
                  </Text>
                  {method.price.toFixed(2)}
                </Text>
              ) : (
                <Text fontWeight="medium">Gratis</Text>
              )}
            </Flex>
          ))}
        </Flex>
      </RadioGroup>
    </>
  );
};
