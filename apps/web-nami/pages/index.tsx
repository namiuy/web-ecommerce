'use client';

import { Flex, Banner, Container, Head, ProductListSection, Brands } from 'ui';
import { NavBar } from '../components';

export default function Web() {
  return (
    <>
      <Head />
      <NavBar />
      <Container p="0" mb="2rem">
        <Flex direction="column" gap="4rem">
          <Banner section="home_a" />
          <ProductListSection name="home_a" />
          <Brands />
        </Flex>
      </Container>
    </>
  );
}
