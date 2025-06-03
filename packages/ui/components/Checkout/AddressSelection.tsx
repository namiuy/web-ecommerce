import { Textarea, RadioGroup, Radio, Icon } from '@chakra-ui/react';
import { Text, Flex, Box } from 'ui';
import { Address } from 'shared/entities/address';
import { MdAdd } from 'react-icons/md';
import { useRouter } from 'next/router';

type AddressProps = {
  addresses: Address[];
  shippingMethod: string;
  address: number;
  observation: string;
  handleAddressChange: (value: number) => void;
  handleObservationChange: (value: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

export const AddressSelection = ({
  addresses,
  shippingMethod,
  address,
  observation,
  handleAddressChange,
  handleObservationChange,
}: AddressProps) => {
  const router = useRouter();

  const handleNewAddress = () => {
    router.replace('/perfil');
  };

  console.log('addresses', addresses);

  return (
    <>
      <Text fontWeight="semibold" fontSize="1.25rem" p="1rem" pt="0.25rem">
        Elige la dirección
      </Text>
      <RadioGroup value={address.toString()} px={{ base: '0', md: '1.5rem' }} mb="1rem">
        <Flex flexDir="column">
          {addresses.map((address, index) => (
            <Flex
              key={index}
              justifyContent="space-between"
              alignItems="center"
              cursor="pointer"
              p="1.25rem"
              borderTop={index != 0 ? '1px' : 0}
              borderColor="blackAlpha.50"
              _hover={{ bg: 'blackAlpha.50' }}
              onClick={() => handleAddressChange(index)}
            >
              <Flex gap="1.5rem" w="100%">
                <Radio value={index.toString()} colorScheme="primary" size="lg" />
                <Text>
                  {address.address}, {address.city_name}, {address.state_name}
                </Text>
              </Flex>
            </Flex>
          ))}
          <Flex
            justifyContent="space-between"
            alignItems="center"
            cursor="pointer"
            p="1.25rem"
            borderTop="1px solid"
            borderColor="blackAlpha.50"
            _hover={{ bg: 'blackAlpha.50' }}
            onClick={handleNewAddress}
          >
            <Flex alignItems="center" gap="1.25rem" w="100%">
              <Icon as={MdAdd} w="1.5rem" h="1.5rem" />
              <Text fontWeight="medium">Agregar una nueva dirección</Text>
            </Flex>
          </Flex>
        </Flex>
      </RadioGroup>
      {shippingMethod === 'INT' && (
        <>
          <Text fontWeight="semibold" fontSize="1.25rem" p="1rem" pt="0.25rem">
            Especifica la empresa de transporte
          </Text>
          <Flex justifyContent="center" alignItems="center">
            {' '}
            <Textarea
              placeholder="Ejemplo: DHL, FedEx, UPS, etc."
              value={observation || ''}
              p="1rem"
              maxW="90%"
              onChange={handleObservationChange}
            />
          </Flex>
        </>
      )}
    </>
  );
};
