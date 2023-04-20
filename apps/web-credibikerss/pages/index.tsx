'use client';

import { NextPage } from 'next';
import { Flex, Banner, Container, Head, ProductListSection, Box, Center } from 'ui';
import { NavBar, Brands } from '../components';

const HomePage: NextPage = () => (
  <>
    <Head />
    <NavBar />
    <Container p="0">
      <Flex direction="column" gap="4rem">
        <Banner>Banner A</Banner>
        <Brands />
        <ProductListSection name="home_a" />
        <Banner showNavigation={false}>Banner sobre financiación</Banner>
        <ProductListSection name="home_b" />
        <Box h="32rem" bg="#1c1e20" pt="14rem">
          <Center color="grey">Footer</Center>
        </Box>
      </Flex>
    </Container>
  </>
);

export default HomePage;
