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

const ALREADY_EXISTS = 'Already exist';
const UNAUTHORIZED = 'Unauthorized';

const _backgroundColor = 'rgba(0, 0, 0, .6)';
const _backdropFilter = 'saturate(180%) blur(6px)';

type ModalNewPhoneProps = {
  id: string;
  personId: string;
  isOpen: boolean;
  onClose: () => void;
  setPersonData: (data: any) => void;
};

export const ModalNewPhone = ({ id, personId, isOpen, onClose, setPersonData }: ModalNewPhoneProps) => {
  const toast = useToast();
  const [changePhoneProps, setChangePhoneProps] = useState<PersonUpdate>();
  const { data, error, isLoading } = useUpdatePerson(changePhoneProps);

  const [newPhone, setNewPhone] = useState();

  useEffect(() => {
    if (!isLoading) {
      if (toast && data && newPhone) {
        const id = 'new-phone-alert';
        if (!toast.isActive(id)) {
          toast({
            id,
            title: 'Teléfono agregado',
            description: 'Se agregó el teléfono correctamente',
            position: 'top',
            status: 'success',
            duration: 4000,
            isClosable: true,
          });
        }

        setPersonData((prevData: any) => {
          const phoneExists = prevData.phones.some((phone: any) => phone.number === newPhone);
          if (!phoneExists) {
            return {
              ...prevData,
              phones: [...prevData.phones, { number: newPhone }],
            };
          }
          return prevData;
        });

        onClose();
      }

      if (error) {
        const id = 'new-phone-alert-error';
        if (!toast.isActive(id)) {
          toast({
            id,
            title: 'Error al agregar el teléfono',
            description: error === ALREADY_EXISTS ? 'El teléfono ya existe' : 'Intentelo más tarde',
            position: 'top',
            status: 'error',
            duration: 4000,
            isClosable: true,
          });
        }
        setChangePhoneProps(undefined);
      }
      setChangePhoneProps(undefined);
    }
  }, [data, toast, error, onClose, isLoading, setPersonData, newPhone]);

  const handleSubmit = (values: any) => {
    setChangePhoneProps({
      id: personId,
      params: [],
      addresses: [],
      phones: [
        {
          number: values.phone,
          mode: 'INS',
        },
      ],
    });
    setNewPhone(values.phone);
  };

  return (
    <Modal isOpen={isOpen} size="lg" onClose={onClose} isCentered>
      <ModalOverlay bg={_backgroundColor} backdropFilter={_backdropFilter} />
      <ModalContent>
        <ModalBody pt="2rem" pb="1.5rem">
          <Formik initialValues={{ phone: '' }} validateOnBlur={false} validateOnChange={false} onSubmit={handleSubmit}>
            {({ errors, handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <Flex flexDir="column" gap="1.5rem" color="blackAlpha.700">
                  <FormControl isInvalid={!!errors.phone} variant="floating">
                    <Field
                      as={Input}
                      placeholder=" "
                      id="phone"
                      name="phone"
                      type="text"
                      isDisabled={isLoading}
                      _focus={{ borderColor: 'primary.main' }}
                      validate={(value: any) => {
                        return validateEmpty(value);
                      }}
                    />
                    <FormLabel>Nuevo teléfono</FormLabel>
                    <FormErrorMessage>{errors.phone}</FormErrorMessage>
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
