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
  useToast,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Flex, Button } from 'ui';
import { Field, Formik } from 'formik';
import { useUpdatePerson, validateEmpty } from 'shared';
import { PersonUpdate } from 'shared/entities/person-update';

const UNAUTHORIZED = 'Unauthorized';

const _backgroundColor = 'rgba(0, 0, 0, .6)';
const _backdropFilter = 'saturate(180%) blur(6px)';

type ModalNameProps = {
  id: string;
  personId: string;
  name: string;
  lastName: string;
  isOpen: boolean;
  onClose: () => void;
  setPersonData: (data: any) => void;
};

export const ModalName = ({ id, personId, name, lastName, isOpen, onClose, setPersonData }: ModalNameProps) => {
  const toast = useToast();
  const [changeNameProps, setChangeNameProps] = useState<PersonUpdate>();
  const { data, error, isLoading } = useUpdatePerson(changeNameProps);

  const [newName, setNewName] = useState(name);
  const [newLastName, setNewLastName] = useState(lastName);

  useEffect(() => {
    if (toast && data) {
      const id = 'password-change-alert';
      if (!toast.isActive(id)) {
        toast({
          id,
          title: 'Nombre cambiado',
          description: 'Su nombre se cambió correctamente',
          position: 'top',
          status: 'success',
          duration: 4000,
          isClosable: true,
        });
      }
      setPersonData((prevData: any) => ({
        ...prevData,
        name: newName,
        last_name: newLastName,
      }));
      onClose();
    }
    if (toast && error) {
      const id = 'name-change-alert-error';
      if (!toast.isActive(id)) {
        toast({
          id,
          title: 'Error al cambiar su nombre',
          description: 'Intentelo más tarde',
          position: 'top',
          status: 'error',
          duration: 4000,
          isClosable: true,
        });
      }
    }
    setChangeNameProps(undefined);
  }, [data, toast, error, onClose, isLoading, setPersonData, newName, newLastName]);

  const handleSubmit = (values: any) => {
    setChangeNameProps({
      id: personId,
      params: [
        { key: 'PersonName', value: values.name },
        { key: 'PersonLastName', value: values.last_name },
      ],
      addresses: [],
      phones: [],
      guid: id,
      update_user: true,
    });
    setNewName(values.name);
    setNewLastName(values.last_name);
  };

  return (
    <Modal isOpen={isOpen} size="lg" onClose={onClose} isCentered>
      <ModalOverlay bg={_backgroundColor} backdropFilter={_backdropFilter} />
      <ModalContent>
        <ModalBody pt="2rem" pb="1.5rem">
          <Formik
            initialValues={{ name: name, last_name: lastName }}
            validateOnBlur={false}
            validateOnChange={false}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, handleSubmit, values }) => (
              <form onSubmit={handleSubmit}>
                <Flex flexDir="column" gap="1.5rem" color="blackAlpha.700">
                  <FormControl isInvalid={!!errors.name} variant="floating">
                    <Field
                      as={Input}
                      touched={touched}
                      placeholder=" "
                      id="name"
                      name="name"
                      type="text"
                      isDisabled={isLoading}
                      _focus={{ borderColor: 'primary.main' }}
                      validate={(value: any) => {
                        return validateEmpty(value);
                      }}
                    />
                    <FormLabel>Nombre</FormLabel>
                    <FormErrorMessage>{errors.name}</FormErrorMessage>
                  </FormControl>
                  <FormControl isInvalid={!!errors.last_name} variant="floating">
                    <Field
                      as={Input}
                      touched={touched}
                      placeholder=" "
                      id="last_name"
                      name="last_name"
                      type="text"
                      isDisabled={isLoading}
                      _focus={{ borderColor: 'primary.main' }}
                      validate={(value: any) => {
                        return validateEmpty(value);
                      }}
                    />
                    <FormLabel>Apellido</FormLabel>
                    <FormErrorMessage>{errors.last_name}</FormErrorMessage>
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
                  <Button disabled={isLoading} colorScheme="gray" color="black" width="20%" onClick={() => onClose()}>
                    Cancelar
                  </Button>{' '}
                  <Button disabled={isLoading} type="submit" colorScheme="primary" color="white" width="75%">
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
