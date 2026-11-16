import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Progress,
  Select,
  useToast,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Flex, Button } from 'ui';
import { Field, Formik } from 'formik';
import { useCityList, useStateList, useUpdatePerson, validateEmpty, validateEmptySelect } from 'shared';
import { PersonUpdate } from 'shared/entities/person-update';
import { City } from 'shared/entities/city';
import { State } from 'shared/entities/state';

const ALREADY_EXISTS = 'Already exist';
const UNAUTHORIZED = 'Unauthorized';

const _backgroundColor = 'rgba(0, 0, 0, .6)';
const _backdropFilter = 'saturate(180%) blur(6px)';

type ModalNewAddressProps = {
  id: string;
  personId: string;
  isOpen: boolean;
  onClose: () => void;
  setPersonData: (data: any) => void;
  redirectTo?: string;
};

export const ModalNewAddress = ({ id, personId, isOpen, onClose, setPersonData, redirectTo }: ModalNewAddressProps) => {
  const toast = useToast();
  const [changeAddressProps, setChangeAddressProps] = useState<PersonUpdate>();
  const { data, error, isLoading } = useUpdatePerson(changeAddressProps);

  const states = useStateList();
  const cities = useCityList();
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [newAddress, setNewAddress] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!isLoading) {
      if (toast && data && newAddress) {
        const id = 'new-address-alert';
        if (!toast.isActive(id)) {
          toast({
            id,
            title: 'Dirección agregada',
            description: 'Se agregó la dirección correctamente',
            position: 'top',
            status: 'success',
            duration: 4000,
            isClosable: true,
          });
        }

        const stateName = states?.data?.find((state: State) => state.id === selectedState)?.name || '';
        const cityName = cities?.data?.find((city: City) => city.id === selectedCity)?.name || '';

        if (newAddress && selectedCity && selectedState && cityName && stateName) {
          setPersonData((prevData: any) => {
            const addressExists = prevData.addresses.some(
              (address: any) =>
                address.address === newAddress && address.city_name === cityName && address.state_name === stateName,
            );
            if (!addressExists) {
              return {
                ...prevData,
                addresses: [...prevData.addresses, { address: newAddress, city_name: cityName, state_name: stateName }],
              };
            }
            return prevData;
          });
        }

        // setNewAddress(undefined);
        // setSelectedCity(null);
        // setSelectedState(null);

        onClose();

        if (redirectTo) {
          window.location.href = `/${redirectTo}`;
        }
      }

      if (error) {
        const id = 'new-address-alert-error';
        if (!toast.isActive(id)) {
          toast({
            id,
            title: 'Error al agregar la dirección',
            description: error === ALREADY_EXISTS ? 'La dirección ya existe' : 'Intentelo más tarde',
            position: 'top',
            status: 'error',
            duration: 4000,
            isClosable: true,
          });
        }
        setChangeAddressProps(undefined);
      }
      setChangeAddressProps(undefined);
    }
  }, [data, error, isLoading, toast, selectedCity, selectedState, newAddress, setPersonData, onClose, states, cities]);

  const handleSubmit = (values: any) => {
    setChangeAddressProps({
      id: personId,
      params: [],
      addresses: [
        {
          address: values.address,
          city_id: selectedCity!,
          city_name: '',
          state_id: selectedState!,
          state_name: '',
          postal_code: values.postal_code,
          mode: 'INS',
        },
      ],
      phones: [],
    });
    setNewAddress(values.address);
  };

  const statesSelect = () => {
    return states?.data?.map((state: State) => (
      <option key={state.id} value={state.id}>
        {state.name}
      </option>
    ));
  };

  const citiesSelect = (id: any) => {
    return cities?.data?.map((city: City) =>
      city.stateId === id ? (
        <option key={city.id} value={city.id}>
          {city.name}
        </option>
      ) : null,
    );
  };

  return (
    <Modal isOpen={isOpen} size="lg" onClose={onClose} isCentered>
      <ModalOverlay bg={_backgroundColor} backdropFilter={_backdropFilter} />
      <ModalContent>
        <ModalBody pt="2rem" pb="1.5rem">
          <Formik
            initialValues={{ address: '', city: '', state: '', postal_code: '' }}
            validateOnBlur={false}
            validateOnChange={false}
            onSubmit={handleSubmit}
          >
            {({ errors, handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <Flex flexDir="column" gap="1.5rem" color="blackAlpha.700">
                  <FormControl isInvalid={!!errors.state} variant="floating">
                    <Field
                      as={Select}
                      placeholder="Seleccione un departamento..."
                      onChange={(e: any) => setSelectedState(e.target.value)}
                      value={selectedState}
                      id="state"
                      name="state"
                      isDisabled={states.isLoading}
                      _focus={{ borderColor: 'primary.main' }}
                      validate={() => validateEmptySelect(selectedState)}
                    >
                      {statesSelect()}
                    </Field>
                    <FormLabel htmlFor="state">Departamento</FormLabel>
                    <FormErrorMessage>{errors.state}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors.city} variant="floating">
                    <Field
                      as={Select}
                      placeholder="Seleccione una localidad..."
                      onChange={(e: any) => setSelectedCity(e.target.value)}
                      value={selectedCity}
                      id="city"
                      name="city"
                      isDisabled={!selectedState || selectedState === '-1' || cities.isLoading}
                      _focus={{ borderColor: 'primary.main' }}
                      validate={() => validateEmptySelect(selectedCity)}
                    >
                      {citiesSelect(selectedState)}
                    </Field>
                    <FormLabel htmlFor="city">Localidad</FormLabel>
                    <FormErrorMessage>{errors.city}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors.address} variant="floating">
                    <Field
                      as={Input}
                      placeholder=" "
                      id="address"
                      name="address"
                      type="text"
                      _focus={{ borderColor: 'primary.main' }}
                      validate={(value: any) => validateEmpty(value)}
                    />
                    <FormLabel>Nueva dirección</FormLabel>
                    <FormErrorMessage>{errors.address}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors.postal_code} variant="floating">
                    <Field
                      as={Input}
                      placeholder=" "
                      id="postal_code"
                      name="postal_code"
                      type="text"
                      _focus={{ borderColor: 'primary.main' }}
                      validate={(value: any) => validateEmpty(value)}
                    />
                    <FormLabel>Código postal</FormLabel>
                    <FormErrorMessage>{errors.postal_code}</FormErrorMessage>
                  </FormControl>
                </Flex>

                <Progress
                  h={isLoading ? '4px' : '1px'}
                  size="xs"
                  isIndeterminate={isLoading}
                  colorScheme="black"
                  my="1.5rem"
                />

                <Flex justify="space-between">
                  <Button colorScheme="gray" onClick={onClose} disabled={isLoading}>
                    Cancelar
                  </Button>
                  <Button type="submit" colorScheme="primary" isDisabled={isLoading}>
                    Confirmar
                  </Button>
                </Flex>
              </form>
            )}
          </Formik>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
