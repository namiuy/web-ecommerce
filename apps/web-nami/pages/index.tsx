'use client';

import { Flex, Banner, Container, Head, ProductListSection } from 'ui';
import { NavBar } from '../components';

export default function Web() {
  return (
    <>
      <Head />
      <NavBar />
      <Container p="0" mb="2rem">
        <Flex direction="column" gap="4rem">
          <Banner>Banner A</Banner>
          <ProductListSection name="home_a" />
        </Flex>
      </Container>
    </>
  );
}
