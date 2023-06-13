'use client';

import { NextPage } from 'next';
import { Flex, Banner, Brands, Container, Head, ProductListSection, Box, Center } from 'ui';
import { NavBar } from '../components';
import { BannerFinancing } from '../components/BannerFinancing';
import { Footer } from '../components/Footer';

const HomePage: NextPage = () => (
  <>
    <Head />
    <NavBar />
    <Container p="0">
      <Flex direction="column" gap="4rem">
        <Banner section="home_a" />
        <Brands />
        <ProductListSection name="home_a" />
        <BannerFinancing />
        <ProductListSection name="home_b" />
      </Flex>
    </Container>
    <Box h="2rem" />
    <Footer />
  </>
);

export default HomePage;
