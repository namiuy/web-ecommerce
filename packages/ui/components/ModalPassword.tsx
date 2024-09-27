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
import { useChangePwdUser, validateEmpty, validatePassword, validateRepeatPassword } from 'shared';
import { UserChangePwd } from 'shared/entities/user-change-pwd';

const UNAUTHORIZED = 'Unauthorized';
const INVALIDA_PARAMETERS = 'Invalid parameters';

const _backgroundColor = 'rgba(0, 0, 0, .6)';
const _backdropFilter = 'saturate(180%) blur(6px)';

type ModalPasswordProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const ModalPassword = ({ isOpen, onClose }: ModalPasswordProps) => {
  const toast = useToast();
  const [changePwdProps, setChangePwdProps] = useState<UserChangePwd>();
  const { data, error, isLoading } = useChangePwdUser(changePwdProps);

  useEffect(() => {
    if (toast && data) {
      const id = 'password-change-alert';
      if (!toast.isActive(id)) {
        toast({
          id,
          title: 'Contraseña cambiada',
          description: 'La contraseña se cambió correctamente',
          position: 'top',
          status: 'success',
          duration: 4000,
          isClosable: true,
        });
      }
      onClose();
    }
    if (toast && error) {
      const id = 'password-change-alert-error';
      if (!toast.isActive(id)) {
        toast({
          id,
          title: 'Error al cambiar la contraseña',
          description:
            error === UNAUTHORIZED
              ? 'La contraseña actual es incorrecta'
              : error === INVALIDA_PARAMETERS
              ? 'La nueva contraseña debe ser diferente a la actual'
              : error,
          position: 'top',
          status: 'error',
          duration: 4000,
          isClosable: true,
        });
      }
    }
    setChangePwdProps(undefined);
  }, [data, toast, error, onClose, isLoading]);

  const handleSubmit = (values: any) => {
    setChangePwdProps({
      password: values.password,
      new_password: values.new_password,
    });
  };

  return (
    <Modal isOpen={isOpen} size="lg" onClose={onClose} isCentered>
      <ModalOverlay bg={_backgroundColor} backdropFilter={_backdropFilter} />
      <ModalContent>
        <ModalBody pt="2rem" pb="1.5rem">
          <Formik
            initialValues={{ password: '', new_password: '', confirm_password: '' }}
            validateOnBlur={false}
            validateOnChange={false}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, handleSubmit, values }) => (
              <form onSubmit={handleSubmit}>
                <Flex flexDir="column" gap="1.5rem" color="blackAlpha.700">
                  <FormControl isInvalid={!!errors.password} variant="floating">
                    <Field
                      as={Input}
                      touched={touched}
                      placeholder=" "
                      id="password"
                      name="password"
                      type="password"
                      isDisabled={isLoading}
                      _focus={{ borderColor: 'primary.main' }}
                      validate={(value: any) => {
                        return validateEmpty(value);
                      }}
                    />
                    <FormLabel>Contraseña actual</FormLabel>
                    <FormErrorMessage>{errors.password}</FormErrorMessage>
                  </FormControl>
                  <FormControl isInvalid={!!errors.new_password} variant="floating">
                    <Field
                      as={Input}
                      touched={touched}
                      placeholder=" "
                      id="new_password"
                      name="new_password"
                      type="password"
                      isDisabled={isLoading}
                      _focus={{ borderColor: 'primary.main' }}
                      validate={(value: any) => {
                        return validatePassword(value);
                      }}
                    />
                    <FormLabel>Nueva contraseña</FormLabel>
                    <FormErrorMessage>{errors.new_password}</FormErrorMessage>
                  </FormControl>
                  <FormControl isInvalid={!!errors.confirm_password} variant="floating">
                    <Field
                      as={Input}
                      touched={touched}
                      placeholder=" "
                      id="confirm_password"
                      name="confirm_password"
                      type="password"
                      isDisabled={isLoading}
                      _focus={{ borderColor: 'primary.main' }}
                      validate={(value: any) => {
                        return validateRepeatPassword(value, values.new_password);
                      }}
                    />
                    <FormLabel>Confirme la nueva contraseña</FormLabel>
                    <FormErrorMessage>{errors.confirm_password}</FormErrorMessage>
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
                  <Button disabled={isLoading} colorScheme="gray" color="black" w="30%" onClick={() => onClose()}>
                    Cancelar
                  </Button>{' '}
                  <Button disabled={isLoading} type="submit" colorScheme="primary" color="white" w="65%">
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
