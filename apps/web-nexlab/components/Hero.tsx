'use client';

import { Box, Heading, Text, Image } from '@chakra-ui/react';
import { Container } from 'ui';

export const Hero = () => {
  return (
    <Box position="relative" bg="white" w="100%" h={{ base: '30rem', sm: '35rem', md: '45rem', lg: '46rem' }} pt="4.5rem" overflow="hidden">
      <Container maxW="container.xl" position="relative" h="100%">
        <Box pt={{ base: '3rem', md: '5rem' }} textAlign={{ base: 'center', lg: 'left' }} zIndex={1}>
          <Text
            fontFamily="mono"
            pb={{ base: '1.5rem', md: '0.5rem' }}
            fontWeight="bold"
            color="gray.600"
            fontSize={{ base: '1rem', sm: '0.875rem', md: '1.25rem' }}
          >
            Quieres innovar, pero aún no sabes dónde empezar.
          </Text>
          <Heading fontSize={{ base: '2rem', md: '3.5rem', lg: '4rem' }} fontWeight="bold" lineHeight="1.2">
            El futuro ya existe. <br /> No sigas esperando.
          </Heading>
        </Box>

        <Image
          src="/buey.png"
          alt="Vehículo autónomo fumigador"
          position="absolute"
          right={{ base: '-1rem', md: '0', lg: '-20rem' }}
          bottom={{ base: '-1rem', md: '-2rem', lg: '-4rem' }}
          w={{ base: '100%', md: '60rem', lg: '70rem' }}
          zIndex={0}
          objectFit="contain"
        />
      </Container>
    </Box>
  );
};
