import {
  Checkbox,
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
  Switch,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Flex, Button } from 'ui';
import { Field, Formik } from 'formik';
import { useUpdatePerson, validateEmpty } from 'shared';
import { PersonUpdate } from 'shared/entities/person-update';
import { FaTrash } from 'react-icons/fa';
import { ConfirmDeleteModal } from './ModalDelete';

const _backgroundColor = 'rgba(0, 0, 0, .6)';
const _backdropFilter = 'saturate(180%) blur(6px)';

type ModalEditPhoneProps = {
  id: string;
  personId: string;
  phone?: string;
  defaultPhone?: string;
  isOpen: boolean;
  onClose: () => void;
  setPersonData: (data: any) => void;
};

export const ModalEditPhone = ({
  id,
  personId,
  phone,
  defaultPhone,
  isOpen,
  onClose,
  setPersonData,
}: ModalEditPhoneProps) => {
  const toast = useToast();
  const { isOpen: isOpenDelete, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure();
  const [changePhoneProps, setChangePhoneProps] = useState<PersonUpdate>();
  const { data, error, isLoading } = useUpdatePerson(changePhoneProps);

  const [newPhone, setNewPhone] = useState<string | undefined>(phone);
  const [initialDefault, setInitialDefault] = useState<boolean>(false);
  const [isDefault, setIsDefault] = useState<boolean>(false);

  useEffect(() => {
    if (phone && defaultPhone) {
      const isInitiallyDefault = phone === defaultPhone;
      setIsDefault(isInitiallyDefault);
      setInitialDefault(isInitiallyDefault);
    }
  }, [phone, defaultPhone]);

  useEffect(() => {
    if (!isLoading) {
      if (data && toast) {
        const id = 'phone-change-alert';
        if (!toast.isActive(id)) {
          toast({
            id,
            title: 'Teléfono actualizado',
            description: 'El teléfono fue actualizado correctamente.',
            position: 'top',
            status: 'success',
            duration: 4000,
            isClosable: true,
          });
        }
        setPersonData((prevData: any) => ({
          ...prevData,
          phones:
            changePhoneProps?.phones[0].mode === 'DLT'
              ? prevData.phones.filter((p: any) => p.number !== phone)
              : prevData.phones.map((p: any) =>
                  p.number === phone
                    ? {
                        ...p,
                        number: newPhone,
                      }
                    : p,
                ),
          default_phone:
            changePhoneProps?.phones[0].mode === 'DLT'
              ? prevData.default_phone
              : isDefault
              ? newPhone
              : prevData.default_phone,
        }));
        onClose(); // Close the modal after success
        setChangePhoneProps(undefined); // Reset state after successful update
      }

      if (error && toast) {
        const id = 'change-phone-alert-error';
        if (!toast.isActive(id)) {
          toast({
            id,
            title: 'Error al actualizar el teléfono',
            description: 'Inténtelo más tarde',
            position: 'top',
            status: 'error',
            duration: 4000,
            isClosable: true,
          });
        }
        setChangePhoneProps(undefined); // Reset state after error
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, error, toast, onClose, setPersonData, newPhone, isDefault, changePhoneProps, phone]);

  const handleSubmit = (values: any) => {
    setNewPhone(values.phone);
    const params = isDefault
      ? [
          {
            key: 'PersonDefaultPhone',
            value: values.phone,
          },
        ]
      : [];
    setChangePhoneProps({
      id: personId,
      params,
      addresses: [],
      phones: [
        {
          type: 'HOM',
          number: values.phone,
          previous_number: phone,
          mode: 'UPD',
        },
      ],
    });
  };

  const handleDelete = () => {
    setChangePhoneProps({
      id: personId,
      params: [],
      addresses: [],
      phones: [
        {
          type: 'HOM',
          number: phone ? phone : '',
          previous_number: phone,
          mode: 'DLT',
        },
      ],
    });
    onCloseDelete();
  };

  return (
    <Modal isOpen={isOpen} size="lg" onClose={onClose} isCentered>
      <ModalOverlay bg={_backgroundColor} backdropFilter={_backdropFilter} />
      <ModalContent>
        <ModalBody pt="2rem" pb="1.5rem">
          <Formik
            initialValues={{ phone: phone }}
            validateOnBlur={false}
            validateOnChange={false}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <Flex gap="0.5rem" color="blackAlpha.700" flexDir="column">
                  <FormControl isInvalid={!!errors.phone} variant="floating">
                    <Field
                      as={Input}
                      touched={touched}
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
                    <FormLabel>Teléfono</FormLabel>
                    <FormErrorMessage>{errors.phone}</FormErrorMessage>
                  </FormControl>
                  <FormControl mt="1rem">
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
                    aria-label="Delete phone"
                    icon={<FaTrash />}
                    onClick={onOpenDelete}
                    isDisabled={isLoading || initialDefault}
                  />
                  <ConfirmDeleteModal
                    isOpen={isOpenDelete}
                    onClose={onCloseDelete}
                    onConfirm={handleDelete}
                    itemType="teléfono"
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
