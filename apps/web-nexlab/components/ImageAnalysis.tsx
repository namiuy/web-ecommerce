import { Box, Heading, Text, Image, VStack, Container } from '@chakra-ui/react';
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
      >
        <Box>
          <Text fontFamily="mono" fontSize={{ base: '1rem', md: '1.75rem' }} pb="0.5rem" fontWeight="bold" color="gray.600">
            Análisis de imágenes
          </Text>
          <Heading fontSize={{ base: '1.5rem', md: '3rem' }} pb="1.5rem" maxW={{ base: '100%', lg: '30rem' }}>
            Procesamos imágenes en tiempo real y las convertimos en datos útiles.
          </Heading>
        </Box>
        <Image src="./manzanas.png" alt="Manzanas" mx="auto" alignSelf="center" w={{ base: '80%', sm: '45%', md: '40rem', lg: 'auto' }} />
      </Flex>
    </Container>
  );
};
