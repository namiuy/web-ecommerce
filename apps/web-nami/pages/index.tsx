'use client';

import { Flex, Banner, Container, Head, ProductListSection, Brands, Footer } from 'ui';
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
      <Footer logo={Logo} />
    </>
  );
}
