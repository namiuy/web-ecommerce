import { Container, Heading, Flex, Box, Text } from 'ui';

export const Workflow = () => {
  return (
    <Container maxW="container.xl" px={4} textAlign="center">
      <Text fontFamily="mono" fontSize={{ base: '1.25rem', md: '1.25rem' }} pb="0.5rem" fontWeight="bold" color="gray.600">
        ¿Cómo trabajamos?
      </Text>
      <Flex flexDir="column" justifyContent="center" alignItems="center" ml={{ base: '0', lg: '1rem' }}>
        <Flex justifyContent="space-between" alignItems="center" gap="2rem" maxW="25rem">
          <Text fontSize="6rem" color="lightgray" fontWeight="medium">
            1
          </Text>
          <Box textAlign="left" maxW={{ base: '12rem', lg: '20rem' }}>
            <Text fontSize={{ base: '1.5rem', lg: '2rem' }} fontWeight="bold">
              Contacto
            </Text>
            <Text fontWeight="medium" lineHeight="1.25rem">
              Nos planteas tu problema, en tus palabras.
            </Text>
          </Box>
        </Flex>
        <Flex justifyContent="space-between" alignItems="center" gap="2rem" maxW="25rem">
          <Text fontSize="6rem" color="lightgray" fontWeight="medium">
            2
          </Text>
          <Box textAlign="left" maxW={{ base: '12rem', lg: '20rem' }}>
            <Text fontSize={{ base: '1.5rem', lg: '2rem' }} fontWeight="bold">
              Análisis
            </Text>
            <Text fontWeight="medium" lineHeight="1.25rem">
              Diagramamos el hardware y software que mejor se ajusta a tus necesidades.
            </Text>
          </Box>
        </Flex>
        <Flex justifyContent="space-between" alignItems="center" gap="2rem" maxW="25rem">
          <Text fontSize="6rem" color="lightgray" fontWeight="medium">
            3
          </Text>
          <Box textAlign="left" maxW={{ base: '12rem', lg: '20rem' }}>
            <Text fontSize={{ base: '1.5rem', lg: '2rem' }} fontWeight="bold">
              Implementación
            </Text>
            <Text fontWeight="medium" lineHeight="1.25rem">
              Construimos lo necesario para solucionar tu problema.
            </Text>
          </Box>
        </Flex>
        <Flex justifyContent="space-between" alignItems="center" gap="2rem" maxW="25rem">
          <Text fontSize="6rem" color="lightgray" fontWeight="medium">
            4
          </Text>
          <Box textAlign="left" maxW={{ base: '12rem', lg: '20rem' }}>
            <Text fontSize={{ base: '1.5rem', lg: '2rem' }} fontWeight="bold">
              Seguimiento
            </Text>
            <Text fontWeight="medium" lineHeight="1.25rem">
              Nos aseguramos que funcione como lo esperas.
            </Text>
          </Box>
        </Flex>
      </Flex>
    </Container>
  );
};
