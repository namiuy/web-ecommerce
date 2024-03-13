'use client';

import { Flex, Box, Banner, Container, Head, ProductListSection, Brands, GaPage, Footer } from 'ui';
import { NavBar } from '../components';
import { Logo } from '../components/LogoWhite';

const _bg = 'brand.background';

export default function Web() {
  return (
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
        <Box bg={_bg} minH="50vh" pb="3rem">
          <ProductListSection name="home_a" />
        </Box>
        <Footer logo={Logo} />
      </>
    </GaPage>
  );
}
