'use client';

import { Box, Flex, Image, Container } from '@chakra-ui/react';
import { Button } from 'ui';

export const NavBar = () => {
  const scrollToBottom = () => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth',
    });
  };
  return (
    <Box
      bg="rgba(255, 255, 255, 0.8)"
      backdropFilter="blur(0.75rem)"
      color="black"
      boxShadow="sm"
      p="1rem"
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex={1000}
      sx={{
        WebkitBackdropFilter: 'blur(0.75rem)',
      }}
    >
      <Container maxW="container.xl" px={{ base: '0rem', lg: '1rem' }} display="flex" justifyContent="space-between" alignItems="center">
        <Image src="./nexlab.svg" alt="Nexlab Logo" w="10rem" />
        <Button onClick={scrollToBottom} bg="#0071e3" color="white" borderRadius="0.5rem" fontWeight="medium" _hover={{ bg: '#005bb5' }} py="1.25rem">
          Contactar
        </Button>
      </Container>
    </Box>
  );
};
