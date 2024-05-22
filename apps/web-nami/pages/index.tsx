'use client';

import { Flex, Box, Banner, Container, Head, ProductListSection, Brands, GaPage } from 'ui';
import { NavBar, Footer } from '../components';
import { NextPage } from 'next';

const _bg = 'brand.background';

const HomePage: NextPage = () => (
  <GaPage page="Home">
    <>
      <Head />
      <NavBar />
      <Container p="0" mb="2rem">
        <Flex direction="column" gap="4rem">
          <Banner section="home_a" />
          <Brands />
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
