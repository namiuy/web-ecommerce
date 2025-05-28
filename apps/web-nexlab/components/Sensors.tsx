import { Box, Heading, Text, Image, VStack, Container } from '@chakra-ui/react';

export const Sensors = () => {
  return (
    <Container maxW="container.xl" mx="auto" px={4}>
      <Box px="1.5rem" py={{ base: '1.5rem', md: '3rem' }} w="100%" bg="white" textAlign="center" borderRadius="2rem">
        <Text fontFamily="mono" fontSize={{ base: '1rem', md: '1.5rem' }} pb="0.5rem" fontWeight="bold" color="gray.600">
          Módulos inteligentes
        </Text>
        <Heading fontSize={{ base: '1.5rem', md: '3rem' }} pb="1.5rem">
          Integramos todo tipo de sensores y <br /> actuadores sin límites.
        </Heading>
        <Image src="./sensor.png" alt="Sensores conectados" mx="auto" />
      </Box>
    </Container>
  );
};
