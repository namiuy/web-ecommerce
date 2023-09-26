import { Box, Button, Center, Container, Flex, Heading } from 'ui';

const _color = 'white';
const _bg = '#171aa6';

export const BannerFinancing = () => {
  return (
    <Box
      bg={_bg}
      borderRadius={{ base: '0', lg: '.5rem' }}
      h={{ base: '14rem', md: '16rem' }}
      p={{ base: '3rem 1rem', sm: '3rem 2rem', md: '4rem 12rem', lg: '5rem 12rem' }}
      color={_color}
    >
      <Container p="0">
        <Flex flexDir="column" alignItems="flex-start">
          <Heading pb="1rem" size={{ base: 'xl', lg: 'lg' }}>
            Conoce mas sobre nuestras opciones de financiación
          </Heading>
          <Button bg="transparent" border="solid 1px white">
            Ver mas
          </Button>
        </Flex>
      </Container>
    </Box>
  );
};
