'use client';

import { Flex, Box, Banner, Container, Head, ProductListSection, Brands, GaPage, Categories, Text } from 'ui';
import { NavBar, Footer } from '../components';
import { NextPage } from 'next';
import { getEnvId } from 'shared';

const _bg = 'brand.background';
const envId = getEnvId();

const MejoraBanner = () => (
  <Box
    bg="linear-gradient(135deg, #1a365d 0%, #2a4365 50%, #2c5282 100%)"
    color="white"
    py={{ base: '2rem', md: '3rem' }}
    px={{ base: '1.5rem', md: '3rem' }}
    borderRadius="lg"
    textAlign="center"
    mx={{ base: '1rem', md: '2rem' }}
    mt="1rem"
  >
    <Text fontSize={{ base: 'xl', md: '2xl' }} fontWeight="bold" mb="0.5rem">
      Estamos haciendo mejoras continuas todos los dias
    </Text>
    <Text fontSize={{ base: 'sm', md: 'md' }} opacity={0.9}>
      Si encuentra alguna dificultad le agradecemos nos avise a{' '}
      <Box as="a" href="mailto:ventas@robotec.com.uy" color="cyan.200" fontWeight="bold" textDecoration="underline">
        ventas@robotec.com.uy
      </Box>
    </Text>
  </Box>
);

const HomePage: NextPage = () => (
  <GaPage page="Home">
    <>
      <Head />
      <NavBar />
      <Container p="0" mb="2rem">
        <Flex direction="column" gap="2rem">
          {envId === 'robotec' ? <MejoraBanner /> : <Banner section="home_a" />}
          <Brands />
          <Categories />
        </Flex>
      </Container>
      <Box bg={_bg} pb={{ base: '2rem', lg: '4rem' }} pt={{ base: '1rem', lg: '0.5rem' }}>
        <ProductListSection name="home_a" />
      </Box>
      <Footer />
    </>
  </GaPage>
);

export default HomePage;
