import { NextPage } from 'next';
import { Box, Container, Button, Text } from 'ui';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { Formik, Field } from 'formik';
import { Link, FormControl, FormLabel, FormErrorMessage, Input, useToast, Progress } from '@chakra-ui/react';
import { useState } from 'react';
import { firebaseResetPassword } from 'shared/services/firebase';
import { GaPage, Head } from 'ui';

const _backgroundColorOne = 'brand.login.backgroundColorOne';
const _backgroundColorTwo = 'brand.login.backgroundColorTwo';
const _backgroundGradient = `linear(to-b, ${_backgroundColorOne} 50%, transparent 50%)`;
const _color = 'brand.login.color';
const _backButtonHover = { color: 'brand.login.backgroundColorOne', backgroundColor: 'white' };
const _loginButtonBg = 'brand.login.backgroundColorOne';
const _containerW = { sm: '25rem', base: '20rem' };

const ResetPasswordPage: NextPage = () => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (values: { email: string }) => {
    setIsLoading(true);
    try {
      await firebaseResetPassword(values.email);
      setSent(true);
      toast({
        title: 'Correo enviado',
        description: 'Revisa tu bandeja de entrada para restablecer tu contraseña.',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
    } catch (error: any) {
      let message = 'Error al enviar el correo. Intenta de nuevo.';
      if (error?.code === 'auth/user-not-found') {
        message = 'No existe una cuenta con ese correo electrónico.';
      } else if (error?.code === 'auth/invalid-email') {
        message = 'El correo electrónico no es válido.';
      }
      toast({
        title: 'Error',
        description: message,
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'top',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GaPage page="ResetPassword">
      <>
        <Head />
        <Box height="100vh" bg={_backgroundColorTwo}>
          <Box bgGradient={_backgroundGradient} h="46rem">
            <Box p="1.5rem" />
            <Container
              maxW={_containerW}
              color="white"
              mt="4rem"
              mb="1rem"
              px={0}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Link href="/iniciar" borderRadius="50%" p="0.25rem" _hover={_backButtonHover}>
                <ArrowBackIcon boxSize="6" />
              </Link>
              <Text fontSize="1.5rem" display="inline-block" fontWeight="bold">
                Restablecer contraseña
              </Text>
              <Box width="2rem">&nbsp;</Box>
            </Container>
            <Container
              maxW={_containerW}
              minH="14rem"
              bg="white"
              boxShadow="lg"
              borderRadius="0.5rem"
              p="2rem 2rem 1rem 2rem"
            >
              {sent ? (
                <Box textAlign="center" py="2rem">
                  <Text fontSize="1.125rem" fontWeight="bold" mb="1rem">
                    Correo enviado
                  </Text>
                  <Text fontSize="0.875rem" color="gray.600" mb="1.5rem">
                    Revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.
                  </Text>
                  <Link href="/iniciar" color={_color} fontSize="0.938rem">
                    Volver a iniciar sesión
                  </Link>
                </Box>
              ) : (
                <Formik
                  initialValues={{ email: '' }}
                  onSubmit={handleSubmit}
                  validateOnChange={false}
                  validateOnBlur={false}
                >
                  {({ handleSubmit, errors }) => (
                    <form onSubmit={handleSubmit}>
                      <Text fontSize="0.875rem" color="gray.600" mb="1.5rem">
                        Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
                      </Text>
                      <FormControl mb="1rem" isInvalid={!!errors.email}>
                        <FormLabel htmlFor="email">Correo electrónico</FormLabel>
                        <Field
                          as={Input}
                          id="email"
                          name="email"
                          type="text"
                          isDisabled={isLoading}
                          variant="filled"
                          _focus={{ borderColor: _color }}
                          validate={(value: any) => {
                            if (!value) return 'Este campo es obligatorio';
                            if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value))
                              return 'El correo electrónico no es válido';
                          }}
                        />
                        <FormErrorMessage>{errors.email}</FormErrorMessage>
                      </FormControl>

                      <Progress
                        h={isLoading ? '4px' : '1px'}
                        m="1rem 0"
                        size="xs"
                        isIndeterminate={isLoading}
                        colorScheme="primary"
                      />

                      <Button
                        type="submit"
                        isDisabled={isLoading}
                        bg={_loginButtonBg}
                        color="white"
                        _hover={{ backgroundColor: _color }}
                        width="100%"
                        mb="0.75rem"
                      >
                        Enviar enlace
                      </Button>
                    </form>
                  )}
                </Formik>
              )}
              <Box mt="0.5rem">
                <Link href="/iniciar" color={_color} fontSize="0.938rem">
                  Volver a iniciar sesión
                </Link>
              </Box>
            </Container>
          </Box>
        </Box>
      </>
    </GaPage>
  );
};

export default ResetPasswordPage;
