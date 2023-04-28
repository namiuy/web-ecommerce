'use client';

import { NextPage } from 'next';
import { Flex, Banner, Brands, Container, Head, ProductListSection, Box, Center } from 'ui';
import { NavBar } from '../components';

const HomePage: NextPage = () => (
  <>
    <Head />
    <NavBar />
    <Container p="0">
      <Flex direction="column" gap="4rem">
        <Banner section="home_a" />
        <Brands />
        <ProductListSection name="home_a" />
        <Banner section="home_b" showNavigation={false} />
        <ProductListSection name="home_b" />
        <Box h="32rem" bg="#1c1e20" pt="14rem">
          <Center color="grey">Footer</Center>
        </Box>
      </Flex>
    </Container>
  </>
);

export default HomePage;
