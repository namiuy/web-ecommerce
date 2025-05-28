import { Box, Heading, Text, Image, VStack, Container } from '@chakra-ui/react';
import { Flex } from 'ui';

export const Robots = () => {
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
          <Text fontFamily="mono" fontSize={{ base: '1rem', md: '1.5rem' }} pb="0.5rem" fontWeight="bold" color="gray.600">
            Robots versátiles
          </Text>
          <Heading fontSize={{ base: '1.5rem', md: '3rem' }} pb="1.5rem" maxW={{ base: '100%', lg: '30rem' }}>
            Construimos tus aliados para el día a día.
          </Heading>
        </Box>
        <Image src="./buey-2.png" alt="Manzanas" mx="auto" alignSelf="center" w={{ base: '80%', sm: '45%', md: '40rem', lg: 'auto' }} />
      </Flex>
    </Container>
  );
};
