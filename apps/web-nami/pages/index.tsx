'use client';

import { Flex, Box, Banner, Container, Head, ProductListSection, Brands, Footer } from 'ui';
import { NavBar } from '../components';
import { Logo } from '../components/LogoWhite';

const _bg = 'brand.background';

export default function Web() {
  return (
    <>
      <Head />
      <NavBar />
      <Container p="0" mb="2rem">
        <Flex direction="column" gap="4rem">
          <Banner section="home_a" />
          <Brands />
          <ProductListSection name="home_a" />
        </Flex>
      </Container>
      <Box bg={_bg} minH="50vh" pb="3rem">
        <ProductListSection name="home_a" />
      </Box>
      <Footer logo={Logo} />
    </>
  );
}
