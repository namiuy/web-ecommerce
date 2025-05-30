import { Box, Heading, Text, Image, VStack, Container } from '@chakra-ui/react';
import { Flex } from 'ui';

export const Automation = () => {
  return (
    <Container maxW="container.xl" mx="auto" px={4} overflow="hidden">
      <Flex
        px={{ base: '1.5rem', md: '1.5rem' }}
        py={{ base: '1.5rem', md: '3rem' }}
        w="100%"
        bg="white"
        textAlign={{ base: 'center', lg: 'left' }}
        flexDirection={{ base: 'column', lg: 'row-reverse' }}
        alignItems="center"
        position="relative"
        h={{ base: '32rem', md: '55rem', lg: '40rem' }}
        borderRadius="2rem"
      >
        <Box>
          <Text fontFamily="mono" fontSize={{ base: '1rem', md: '1.5rem' }} pb="0.5rem" fontWeight="bold" color="gray.600">
            Automatización
          </Text>
          <Heading fontSize={{ base: '1.5rem', md: '3rem' }} pb="1.5rem" maxW={{ base: '100%', lg: '30rem' }}>
            Logramos mayor rendimiento y precisión con menor esfuerzo.
          </Heading>
        </Box>
        <Image
          position="absolute"
          bottom="-5rem"
          left={{ base: '4rem', sm: '10rem', md: '12rem' }}
          src="./brazo-robot.png"
          alt="Brazo robótico"
          mx="auto"
          alignSelf="center"
          w={{ base: '15rem', md: '25rem', lg: '25rem' }}
        />
      </Flex>
    </Container>
  );
};
