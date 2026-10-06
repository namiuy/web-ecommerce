import { Box, Container, Button, Text } from 'ui';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { Formik, Field } from 'formik';
import { Link, FormControl, FormLabel, FormErrorMessage, Input, useToast, Progress } from '@chakra-ui/react';
import { FC, useEffect, useState } from 'react';
import { useSignIn, useSignInWithGoogle, trackLogin } from 'shared';
import { useRouter } from 'next/router';
import { Divider as ChakraDivider } from '@chakra-ui/react';

const USER_OR_PWD_ICORRECT = 'The user or password is incorrect';
const UNAUTHORIZED = 'Unauthorized';

const _backgroundColorOne = 'brand.login.backgroundColorOne';
const _backgroundColorTwo = 'brand.login.backgroundColorTwo';
const _backgroundGradient = `linear(to-b, ${_backgroundColorOne} 50%, transparent 50%)`;
const _color = 'brand.login.color';

const _backButtonHover = { color: 'brand.login.backgroundColorOne', backgroundColor: 'white' };
const _loginButtonBg = 'brand.login.backgroundColorOne';

const _logoPosition = { base: 'center', lg: 'start' };

const _containerW = { sm: '25rem', base: '20rem' };

type SignInProps = {
  Logo: FC;
};

type SignInValues = {
  email: string;
  password: string;
};

export const SignIn = ({ Logo }: SignInProps) => {
  const router = useRouter();
  const toast = useToast();
  const [signInProps, setSignInProps] = useState<SignInValues>();
  const { isLoading, data, error } = useSignIn(signInProps);
  const { signIn: googleSignIn, isLoading: googleLoading, data: googleData, error: googleError } = useSignInWithGoogle();

  const initialValues: SignInValues = {
    email: '',
    password: '',
  };

  useEffect(() => {
    if (toast && error) {
      const id = 'sign-in-alert-error';
      if (!toast.isActive(id)) {
        toast({
          id,
          title: 'Error al iniciar sesión',
          description:
            error === USER_OR_PWD_ICORRECT || error === UNAUTHORIZED
              ? 'El usuario o la contraseña es incorrecto/a'
              : error,
          position: 'top',
          status: 'error',
          duration: 4000,
          isClosable: true,
        });
      }
      setSignInProps(undefined);
    }
  }, [toast, error]);

  useEffect(() => {
    if (data || googleData) {
      trackLogin(googleData ? 'google' : 'password');
      const redirectPath = sessionStorage.getItem('redirectAfterLogin');
      if (redirectPath) {
        sessionStorage.removeItem('redirectAfterLogin');
        router.push(redirectPath);
      } else {
        router.push('/');
      }
    }
  }, [router, data, googleData]);

  useEffect(() => {
    if (toast && googleError) {
      const id = 'google-sign-in-error';
      if (!toast.isActive(id)) {
        toast({
          id,
          title: 'Error al iniciar sesión con Google',
          description: googleError,
          position: 'top',
          status: 'error',
          duration: 4000,
          isClosable: true,
        });
      }
    }
  }, [toast, googleError]);

  const handleSubmit = async (values: SignInValues) => {
    setSignInProps(values);
  };

  return (
    <Box height="100vh" bg={_backgroundColorTwo}>
      <Box bgGradient={_backgroundGradient} h="46rem">
        <Link href="/" p="1.5rem" display="flex" justifyContent={_logoPosition}>
          <Logo />
        </Link>
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
          <Link href="/" borderRadius="50%" p="0.25rem" _hover={_backButtonHover}>
            {''}
            <ArrowBackIcon boxSize="6" />
          </Link>
          <Text fontSize="1.875rem" display="inline-block" fontWeight="bold">
            ¡Bienvenido!
          </Text>
          <Box width="2rem"> &nbsp;</Box>
        </Container>
        <Container
          maxW={_containerW}
          minH="20rem"
          bg="white"
          boxShadow="lg"
          borderRadius="0.5rem"
          p="2rem 2rem 1rem 2rem"
        >
          <Formik initialValues={initialValues} onSubmit={handleSubmit} validateOnChange={false} validateOnBlur={false}>
            {({ handleSubmit, errors }) => (
              <form onSubmit={handleSubmit}>
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
                <FormControl isInvalid={!!errors.password}>
                  <FormLabel htmlFor="password">Contraseña</FormLabel>
                  <Field
                    as={Input}
                    id="password"
                    name="password"
                    type="password"
                    isDisabled={isLoading}
                    variant="filled"
                    _focus={{ borderColor: _color }}
                    validate={(value: any) => {
                      if (!value) return 'Este campo es obligatorio';
                      if (value.length < 6) return 'La contraseña debe tener al menos 6 caracteres';
                    }}
                  />
                  <FormErrorMessage>{errors.password}</FormErrorMessage>
                </FormControl>

                <Box mt="0.375rem" mb="1rem" textAlign="end">
                  <Link href="/reset-password" color={_color} fontSize="0.875rem">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </Box>

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
                  isDisabled={isLoading || googleLoading}
                  bg={_loginButtonBg}
                  color="white"
                  _hover={{ backgroundColor: _color }}
                  width="100%"
                  mb="0.75rem"
                >
                  Iniciar sesión
                </Button>
              </form>
            )}
          </Formik>

          <Box display="flex" alignItems="center" my="0.75rem">
            <ChakraDivider />
            <Text px="0.75rem" fontSize="0.8rem" color="gray.500" whiteSpace="nowrap">o</Text>
            <ChakraDivider />
          </Box>

          <Button
            onClick={googleSignIn}
            isDisabled={isLoading || googleLoading}
            isLoading={googleLoading}
            width="100%"
            mb="0.75rem"
            variant="outline"
            borderColor="gray.300"
            _hover={{ bg: 'gray.50' }}
            leftIcon={
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
            }
          >
            Continuar con Google
          </Button>

          <Box>
            <Link href="/registro" color={_color} fontSize="0.938rem">
              ¿No tienes una cuenta? Regístrate
            </Link>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};
