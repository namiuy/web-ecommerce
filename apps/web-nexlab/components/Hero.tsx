'use client';

import { Box, Heading, Text, Image } from '@chakra-ui/react';
import { Container } from 'ui';

export const Hero = () => {
  return (
    <Box position="relative" bg="white" w="100%" h={{ base: '38rem', sm: '40rem', md: '48rem', lg: '43rem' }} pt="4.5rem" overflow="hidden">
      <Container maxW="container.lg" zIndex={1}>
        <Box pt={{ base: '3rem', md: '5rem' }} textAlign={{ base: 'center', lg: 'left' }}>
          <Text fontFamily="mono" pb={{ base: '1.5rem', md: '0.5rem' }} fontWeight="bold" color="gray.600">
            Quieres innovar, pero aún no sabes dónde empezar.
          </Text>
          <Heading fontSize={{ base: '3rem', md: '4rem' }} fontWeight="bold" lineHeight="1.2">
            El futuro ya existe. <br /> No sigas esperando.
          </Heading>
        </Box>
      </Container>
      <Image
        src="/buey.png"
        alt="Vehículo autónomo fumigador"
        position="absolute"
        right={{ base: '0', md: '0', lg: '-15rem' }}
        bottom={{ base: '-3rem', sm: '-4rem', md: '-6rem' }}
        w={{ base: '100%', md: '60rem', lg: '70rem' }}
        zIndex={0}
        objectFit="contain"
      />
    </Box>
  );
};
