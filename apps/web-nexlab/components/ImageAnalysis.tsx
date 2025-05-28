import { Box, Heading, Text, VStack, Container } from '@chakra-ui/react';
import { Flex } from 'ui';

export const ImageAnalysis = () => {
  return (
    <Container maxW="container.xl" mx="auto" px={4}>
      <Flex
        px="3rem"
        py={{ base: '1.5rem', md: '3rem' }}
        w="100%"
        bg="white"
        textAlign={{ base: 'center', lg: 'left' }}
        flexDirection={{ base: 'column', lg: 'row' }}
        borderRadius="2rem"
        justifyContent={{ base: 'center', lg: 'space-between' }}
        gap={{ base: '0', lg: '1.5rem' }}
      >
        <Box>
          <Text fontFamily="mono" fontSize={{ base: '1rem', md: '1.5rem' }} pb="0.5rem" fontWeight="bold" color="gray.600">
            Análisis de imágenes
          </Text>
          <Heading fontSize={{ base: '1.5rem', md: '3rem' }} pb="1.5rem" maxW={{ base: '100%', lg: '30rem' }}>
            Procesamos imágenes en tiempo real y las convertimos en datos útiles.
          </Heading>
        </Box>

        <Box
          as="video"
          src="./manzanas.mp4"
          autoPlay
          loop
          muted
          mx="0"
          alignSelf="center"
          w={{ base: '100%', sm: '22rem', md: '30rem', lg: '30rem', xl: '36rem' }}
          borderRadius="1rem"
        />
      </Flex>
    </Container>
  );
};
