import { Box, Container, Heading, Button, Flex, Text } from 'ui';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { Formik, Field } from 'formik';
import { Link, FormControl, FormLabel, FormErrorMessage, Input, Icon, Progress, useToast } from '@chakra-ui/react';
import { FC, useEffect, useState } from 'react';
import { useRestorePwd2, validatePassword, validateRepeatPassword } from 'shared';
import { UserRestorePwd2 } from 'shared/entities/user-restore-pwd-2';
import { useRouter } from 'next/router';
import { BsFillCheckCircleFill } from 'react-icons/bs';

const _backgroundColorOne = 'brand.login.backgroundColorOne';
const _backgroundColorTwo = 'brand.login.backgroundColorTwo';
const _backgroundGradient = `linear(to-b, ${_backgroundColorOne} 50%, transparent 50%)`;

const _backButtonHover = { color: 'brand.login.backgroundColorOne', backgroundColor: 'white' };
const _loginButtonBg = 'brand.login.backgroundColorOne';

const INVALIDA_PARAMETERS = 'Invalid parameters';
const GONE = 'Expired token';
const INVALID_TOKEN = 'Invalid token';

type PasswordResetProps = {
  Logo: FC;
};

export const PasswordReset2 = ({ Logo }: PasswordResetProps) => {
  const router = useRouter();
  const { mail, key } = router.query;

  const mailString = typeof mail === 'string' ? mail : Array.isArray(mail) ? mail[0] : '';
  const keyString = typeof key === 'string' ? key : Array.isArray(key) ? key[0] : '';

  const [new_password, setPassword] = useState('');
  const [restorePwdProps, setRestorePwdProps] = useState<UserRestorePwd2>();
  const { isLoading, data, error } = useRestorePwd2(restorePwdProps);
  const toast = useToast();

  useEffect(() => {
    if (toast && error) {
      const id = 'password-reset-2-alert-error';
      if (!toast.isActive(id)) {
        toast({
          id,
          title: 'Error al restablecer contraseña',
          description:
            error === INVALIDA_PARAMETERS
              ? 'Contraseña invalida, intente con otra'
              : error === GONE
              ? 'La clave ha expirado, obtenga otra'
              : error === INVALID_TOKEN
              ? 'La clave es inválida, obtenga otra'
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
          <Link href="/restablecer-contrasena" mr="2rem" borderRadius="50%" p="0.25rem" _hover={_backButtonHover}>
            {''}
            <ArrowBackIcon boxSize="6" />
          </Link>
          <Heading fontSize="1.5rem" display="inline-block">
            Restablece tu contraseña
          </Heading>
        </Container>
        <Container maxW="25rem" color="white" mb="1rem" px={0} display="flex" justifyContent="center">
          <Heading fontSize="1.25rem" color="white">
            Paso 2
          </Heading>
        </Container>
        <Container maxW="25rem" minH="13rem" bg="white" boxShadow="lg" borderRadius="0.5rem" p="2rem 2rem 1rem 2rem">
          {data ? (
            <Flex textAlign="center" flexDir="column" justifyContent="center" alignItems="center" h="9rem">
              <Icon as={BsFillCheckCircleFill} color="green.500" w="3rem" h="3rem"></Icon>
              <Text w="80%" fontSize="1.375rem" fontWeight="medium" lineHeight="2rem" pb="0.25rem" pt="0.75rem">
                Ha cambiado su contraseña existosamente.
              </Text>
              <Flex gap="0.25rem">
                <Text fontSize="1.125rem">Ya puede</Text>
                <Link href="/iniciar" color="primary.main" fontSize="1.125rem" fontWeight="medium">
                  iniciar sesión
                </Link>
              </Flex>
            </Flex>
          ) : (
            <Formik
              initialValues={{
                new_password: '',
                confirm_new_password: '',
              }}
              onSubmit={() => {
                setRestorePwdProps({
                  email: mailString,
                  key: keyString,
                  new_password: new_password,
                });
              }}
              validateOnChange={false}
              validateOnBlur={false}
            >
              {({ handleSubmit, errors }) => (
                <form onSubmit={handleSubmit}>
                  <FormControl mb="1.5rem" isInvalid={!!errors.new_password}>
                    <FormLabel htmlFor="new_password">Nueva contraseña</FormLabel>
                    <Field
                      as={Input}
                      id="new_password"
                      name="new_password"
                      type="password"
                      variant="filled"
                      disabled={isLoading}
                      _focus={{ borderColor: 'primary.main' }}
                      onChange={(e: any) => {
                        setPassword(e.target.value);
                      }}
                      value={new_password}
                      validate={() => {
                        return validatePassword(new_password);
                      }}
                    />
                    <FormErrorMessage>{errors.new_password}</FormErrorMessage>
                  </FormControl>
                  <FormControl mb="1.5rem" isInvalid={!!errors.confirm_new_password}>
                    <FormLabel htmlFor="confirm_new_password">Confirme la nueva contraseña</FormLabel>
                    <Field
                      as={Input}
                      id="confirm_new_password"
                      name="confirm_new_password"
                      type="password"
                      variant="filled"
                      disabled={isLoading}
                      _focus={{ borderColor: 'primary.main' }}
                      validate={(confirm_new_password: any) => {
                        return validateRepeatPassword(confirm_new_password, new_password);
                      }}
                    />
                    <FormErrorMessage>{errors.confirm_new_password}</FormErrorMessage>
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
                    disabled={isLoading}
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
