'use client';

import { NextPage } from 'next';
import { Flex, Banner, Container, Head, ProductListSection } from 'ui';
import { NavBar, Brands, Categories } from '../components';

const HomePage: NextPage = () => (
  <>
    <Head />
    <NavBar />
    <Container p="0" mb="2rem">
      <Flex direction="column" gap="4rem">
        <Banner>Banner A</Banner>
        <Categories />
        <ProductListSection name="home_a" />
        <Banner>Banner X</Banner>
        <ProductListSection name="home_b" />
        <Brands />
      </Flex>
    </Container>
  </>
);

export default HomePage;
