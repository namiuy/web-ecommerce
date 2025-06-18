import { Box, Container, Button, Text } from 'ui';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { Formik, Field } from 'formik';
import { Link, FormControl, FormLabel, FormErrorMessage, Input, useToast, Progress } from '@chakra-ui/react';
import { FC, useEffect, useState } from 'react';
import { useSignIn } from 'shared';
import { useRouter } from 'next/router';

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
    if (data) {
      const redirectPath = sessionStorage.getItem('redirectAfterLogin');
      if (redirectPath) {
        sessionStorage.removeItem('redirectAfterLogin');
        router.push(redirectPath);
      } else {
        router.push('/');
      }
    }
  }, [router, data]);

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
                      let error;

                      if (!value) {
                        error = 'Este campo es obligatorio';
                      }

                      return error;
                    }}
                  />
                  <FormErrorMessage>{errors.password}</FormErrorMessage>
                </FormControl>

                <Box mt="0.375rem" mb="1rem" textAlign="end">
                  <Link href="/restablecer-contrasena" color={_color} fontSize="0.875rem">
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
                  isDisabled={isLoading}
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
