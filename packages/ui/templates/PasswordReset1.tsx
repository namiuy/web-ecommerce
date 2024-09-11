import { Box, Container, Heading, Button, Text, Flex } from 'ui';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { Formik, Field } from 'formik';
import { Link, FormControl, FormLabel, FormErrorMessage, Input, Icon, Progress, useToast } from '@chakra-ui/react';
import { FC, useEffect, useState } from 'react';
import { useRestorePwd1 } from 'shared';
import { UserRestorePwd1 } from 'shared/entities/user-restore-pwd-1';
import { BsFillCheckCircleFill } from 'react-icons/bs';

const _backgroundColorOne = 'brand.login.backgroundColorOne';
const _backgroundColorTwo = 'brand.login.backgroundColorTwo';
const _backgroundGradient = `linear(to-b, ${_backgroundColorOne} 50%, transparent 50%)`;

const _backButtonHover = { color: 'brand.login.backgroundColorOne', backgroundColor: 'white' };
const _loginButtonBg = 'brand.login.backgroundColorOne';

const NOT_FOUND = 'Not found';
const TOO_MANY_REQUESTS = 'Timed out';

type PasswordResetProps = {
  Logo: FC;
};

export const PasswordReset1 = ({ Logo }: PasswordResetProps) => {
  const [restorePwdProps, setRestorePwdProps] = useState<UserRestorePwd1>();
  const { isLoading, data, error } = useRestorePwd1(restorePwdProps);
  const toast = useToast();

  useEffect(() => {
    if (toast && error) {
      const id = 'password-reset-1-alert-error';
      if (!toast.isActive(id)) {
        toast({
          id,
          title: 'Error al restablecer contraseña',
          description:
            error === NOT_FOUND
              ? 'No existe un usuario con ese correo'
              : error === TOO_MANY_REQUESTS
              ? 'Intente de nuevo más tarde.'
              : error,
          position: 'top',
          status: 'error',
          duration: 4000,
          isClosable: true,
        });
      }
      setRestorePwdProps(undefined);
    }
  }, [toast, error]);

  return (
    <Box height="100vh" bg={_backgroundColorTwo}>
      <Box bgGradient={_backgroundGradient} h="40rem">
        <Box p="1.5rem" display="flex" justifyContent={{ base: 'center', lg: 'start' }}>
          <Logo />
        </Box>
        <Container maxW="25rem" color="white" mt="5rem" mb="0.5rem" px={0} display="flex" alignItems="center">
          <Link href="/iniciar" mr="2rem" borderRadius="50%" p="0.25rem" _hover={_backButtonHover}>
            {''}
            <ArrowBackIcon boxSize="6" />
          </Link>
          <Heading fontSize="1.5rem" display="inline-block">
            Restablece tu contraseña
          </Heading>
        </Container>
        <Container maxW="25rem" color="white" mb="1rem" px={0} display="flex" justifyContent="center">
          <Heading fontSize="1.25rem" color="white">
            Paso 1
          </Heading>
        </Container>
        <Container maxW="25rem" minH="13rem" bg="white" boxShadow="lg" borderRadius="0.5rem" p="2rem 2rem 1rem 2rem">
          {data ? (
            <Flex textAlign="center" flexDir="column" justifyContent="center" alignItems="center" gap="1rem" h="9rem">
              <Icon as={BsFillCheckCircleFill} color="green.500" w="3rem" h="3rem"></Icon>
              <Text w="80%" fontSize="1.375rem" fontWeight="medium" lineHeight="2rem">
                Compruebe su email para continuar con el proceso.
              </Text>
            </Flex>
          ) : (
            <Formik
              initialValues={{
                email: '',
              }}
              onSubmit={values => {
                setRestorePwdProps({
                  email: values.email,
                });
              }}
              validateOnChange={false}
              validateOnBlur={false}
            >
              {({ handleSubmit, errors }) => (
                <form onSubmit={handleSubmit}>
                  <FormControl isInvalid={!!errors.email}>
                    <FormLabel htmlFor="email">Correo electrónico</FormLabel>
                    <Field
                      as={Input}
                      id="email"
                      name="email"
                      type="text"
                      variant="filled"
                      disabled={isLoading}
                      _focus={{ borderColor: 'primary.main' }}
                      validate={(value: any) => {
                        let error;

                        if (!value) {
                          error = 'Este campo es obligatorio';
                        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
                          error = 'El correo electrónico no es válido';
                        }

                        return error;
                      }}
                    />
                    <FormErrorMessage>{errors.email}</FormErrorMessage>
                  </FormControl>
                  <Box>
                    <Progress
                      h={isLoading ? '4px' : '1px'}
                      m="1rem 0"
                      size="xs"
                      isIndeterminate={isLoading}
                      colorScheme="primary"
                    />
                  </Box>
                  <Button
                    type="submit"
                    bg={_loginButtonBg}
                    color="white"
                    width="100%"
                    _hover={{ backgroundColor: 'primary.main' }}
                    mb="0.75rem"
                    isDisabled={isLoading}
                  >
                    Enviar
                  </Button>
                </form>
              )}
            </Formik>
          )}
        </Container>
      </Box>
    </Box>
  );
};
