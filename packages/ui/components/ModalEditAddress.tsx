import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Progress,
  Select,
  Switch,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Flex, Button } from 'ui';
import { Field, Formik } from 'formik';
import { useCityList, useStateList, useUpdatePerson, validateEmpty, validateEmptySelect } from 'shared';
import { PersonUpdate } from 'shared/entities/person-update';
import { FaTrash } from 'react-icons/fa';
import { State } from 'shared/entities/state';
import { City } from 'shared/entities/city';
import { ConfirmDeleteModal } from './ModalDelete';

const _backgroundColor = 'rgba(0, 0, 0, .6)';
const _backdropFilter = 'saturate(180%) blur(6px)';

type ModalEditAddressProps = {
  id: string;
  personId: string;
  address: string;
  city_id: string;
  city_name: string;
  state_id: string;
  state_name: string;
  postal_code: string;
  default_address?: string;
  isOpen: boolean;
  onClose: () => void;
  setPersonData: (data: any) => void;
};

export const ModalEditAddress = ({
  id,
  personId,
  address,
  city_id,
  state_id,
  postal_code,
  default_address,
  isOpen,
  onClose,
  setPersonData,
}: ModalEditAddressProps) => {
  const toast = useToast();
  const { isOpen: isOpenDelete, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure();
  const [changeAddressProps, setChangeAddressProps] = useState<PersonUpdate>();
  const { data, error, isLoading } = useUpdatePerson(changeAddressProps);

  const [newAddress, setNewAddress] = useState<string | undefined>(address);
  const [newPostalCode, setNewPostalCode] = useState<string | undefined>(postal_code);

  const [initialDefault, setInitialDefault] = useState<boolean>(false);
  const [isDefault, setIsDefault] = useState<boolean>(false);
  const [isDelete, setIsDelete] = useState<boolean>(false);

  const states = useStateList();
  const cities = useCityList();
  const [selectedState, setSelectedState] = useState<string>();
  const [selectedCity, setSelectedCity] = useState<string>();

  useEffect(() => {
    if (address && default_address) {
      const isInitiallyDefault = address === default_address;
      setIsDefault(isInitiallyDefault);
      setInitialDefault(isInitiallyDefault);
    }
    setSelectedCity(city_id);
    setSelectedState(state_id);
  }, [address, default_address, city_id, state_id]);

  useEffect(() => {
    if (!isLoading && data) {
      const id = 'address-update-success';
      if (!toast.isActive(id)) {
        toast({
          id,
          title: 'Dirección actualizada',
          description: 'La dirección fue actualizada correctamente.',
          position: 'top',
          status: 'success',
          duration: 4000,
          isClosable: true,
        });
      }

      const selectedStateObj = states?.data?.find((state: State) => state.id === selectedState);
      const selectedCityObj = cities?.data?.find((city: City) => city.id === selectedCity);
      const stateName = selectedStateObj?.name || '';
      const cityName = selectedCityObj?.name || '';

      setPersonData((prevData: any) => ({
        ...prevData,
        addresses: isDelete
          ? prevData.addresses.filter((a: any) => a.address !== address)
          : prevData.addresses.map((a: any) =>
              a.address === address
                ? {
                    ...a,
                    address: newAddress,
                    city_name: cityName,
                    state_name: stateName,
                    postal_code: newPostalCode,
                  }
                : a,
            ),
        default_address: isDefault ? newAddress : prevData.default_address,
      }));

      setChangeAddressProps(undefined);
      onClose();
    }

    if (!isLoading && error) {
      const id = 'address-update-error';
      if (!toast.isActive(id)) {
        toast({
          id,
          title: 'Error al actualizar la dirección',
          description: 'Inténtelo más tarde',
          position: 'top',
          status: 'error',
          duration: 4000,
          isClosable: true,
        });
      }

      setChangeAddressProps(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    data,
    error,
    isLoading,
    toast,
    onClose,
    setPersonData,
    changeAddressProps,
    isDelete,
    address,
    newAddress,
    newPostalCode,
    selectedCity,
    selectedState,
    isDefault,
  ]);

  const handleDelete = () => {
    setChangeAddressProps({
      id: personId,
      params: [],
      addresses: [
        {
          address: address,
          previous_address: address,
          city_id: city_id,
          previous_city_id: city_id,
          city_name: '',
          state_id: state_id,
          previous_state_id: state_id,
          state_name: '',
          postal_code: postal_code,
          previous_postal_code: postal_code,
          mode: 'DLT',
        },
      ],
      phones: [],
    });
    setIsDelete(true);
    onCloseDelete();
  };

  const handleSubmit = (values: any) => {
    setNewAddress(values.address);
    setNewPostalCode(values.postal_code);
    setChangeAddressProps({
      id: personId,
      params: isDefault ? [{ key: 'PersonDefaultAddress', value: values.address }] : [],
      addresses: [
        {
          address: values.address,
          previous_address: address,
          city_id: selectedCity!,
          previous_city_id: city_id,
          city_name: '',
          state_id: selectedState!,
          previous_state_id: state_id,
          state_name: '',
          postal_code: values.postal_code,
          previous_postal_code: postal_code,
          mode: 'UPD',
        },
      ],
      phones: [],
    });
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
            initialValues={{
              address: address,
              state: state_id,
              city: city_id,
              postal_code: postal_code,
            }}
            validateOnBlur={false}
            validateOnChange={false}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, handleSubmit }) => (
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
                      isDisabled={cities.isLoading}
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
                      touched={touched}
                      placeholder=" "
                      id="address"
                      name="address"
                      type="text"
                      isDisabled={isLoading}
                      validate={(value: any) => validateEmpty(value)}
                    />
                    <FormLabel htmlFor="address">Dirección</FormLabel>
                    <FormErrorMessage>{errors.address}</FormErrorMessage>
                  </FormControl>
                  <FormControl isInvalid={!!errors.postal_code} variant="floating">
                    <Field
                      as={Input}
                      touched={touched}
                      placeholder=" "
                      id="postal_code"
                      name="postal_code"
                      type="text"
                      isDisabled={isLoading}
                      validate={(value: any) => validateEmpty(value)}
                    />
                    <FormLabel htmlFor="postal_code">Código postal</FormLabel>
                    <FormErrorMessage>{errors.postal_code}</FormErrorMessage>
                  </FormControl>
                  <FormControl>
                    <Flex alignItems="center" gap="0.75rem">
                      <Switch
                        colorScheme="primary"
                        isChecked={isDefault}
                        onChange={e => setIsDefault(e.target.checked)}
                        isDisabled={isLoading || initialDefault}
                      />
                      Defecto
                    </Flex>
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
                  <IconButton
                    w="10%"
                    aria-label="Delete address"
                    icon={<FaTrash />}
                    onClick={onOpenDelete}
                    isDisabled={isLoading || initialDefault}
                  />
                  <ConfirmDeleteModal
                    isOpen={isOpenDelete}
                    onClose={onCloseDelete}
                    onConfirm={handleDelete}
                    itemType="dirección"
                  />
                  <Button disabled={isLoading} colorScheme="gray" color="black" width="20%" onClick={() => onClose()}>
                    Cancelar
                  </Button>
                  <Button disabled={isLoading} type="submit" colorScheme="primary" color="white" width="65%">
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
