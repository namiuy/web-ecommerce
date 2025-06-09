import { Box, Container, Heading, Flex, Text } from 'ui';
import { Link, Icon, Spinner } from '@chakra-ui/react';
import { FC } from 'react';
import { useRouter } from 'next/router';
import { BsFillCheckCircleFill } from 'react-icons/bs';
import { useActivateAccount } from 'shared';

const _backgroundColorOne = 'brand.login.backgroundColorOne';
const _backgroundColorTwo = 'brand.login.backgroundColorTwo';
const _backgroundGradient = `linear(to-b, ${_backgroundColorOne} 50%, transparent 50%)`;

type PasswordResetProps = {
  Logo: FC;
};

export const RegisterActivation = ({ Logo }: PasswordResetProps) => {
  const router = useRouter();
  const { urlActivation } = router.query;

  const url = urlActivation ? urlActivation.toString() : '';

  const { data, isLoading, error } = useActivateAccount(url);

  return (
    <Box height="100vh" bg={_backgroundColorTwo}>
      <Box bgGradient={_backgroundGradient} h="40rem">
        <Link href="/" p="1.5rem" display="flex" justifyContent={{ base: 'center', lg: 'start' }}>
          <Logo />
        </Link>
        <Container
          maxW="25rem"
          color="white"
          mt="5rem"
          mb="1rem"
          px={0}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Heading size="lg">Activación</Heading>
        </Container>
        <Container maxW="25rem" minH="15rem" bg="white" boxShadow="lg" borderRadius="0.5rem" p="3rem 2rem 1rem 2rem">
          {data ? (
            <Flex textAlign="center" flexDir="column" justifyContent="center" alignItems="center" h="9rem">
              <Icon as={BsFillCheckCircleFill} color="green.500" w="2.75rem" h="2.75rem"></Icon>
              <Text w="80%" fontSize="1.375rem" fontWeight="medium" lineHeight="2rem" pb="0.75rem" pt="1rem">
                Tu cuenta ha sido activada existosamente
              </Text>
              <Flex gap="0.25rem">
                <Text fontSize="1.125rem">Ya puedes</Text>
                <Link href="/iniciar" color="primary.main" fontSize="1.125rem" fontWeight="medium">
                  iniciar sesión
                </Link>
              </Flex>
            </Flex>
          ) : (
            <Flex textAlign="center" flexDir="column" justifyContent="center" alignItems="center" h="9rem">
              {isLoading && <Spinner size="lg" />}
              {error && (
                <Text w="80%" fontSize="1.375rem" fontWeight="medium" lineHeight="2rem" pb="0.75rem" pt="1rem">
                  El enlace de activación es inválido o ha expirado
                </Text>
              )}
            </Flex>
          )}
        </Container>
      </Box>
    </Box>
  );
};
