'use client';

import { NextPage } from 'next';
import { Flex, Banner, Brands, Container, Head, ProductListSection, Box } from 'ui';
import { NavBar } from '../components';
//import { BannerFinancing } from '../components/BannerFinancing';
import { Footer } from '../components/Footer';

const _bg = 'brand.background';

const HomePage: NextPage = () => (
  <>
    <Head />
    <NavBar />
    <Container p="0" pb="2rem">
      <Banner section="home_a" />
      <Box m="3rem 2rem">
        {' '}
        <Brands />{' '}
      </Box>
    </Container>
    <Box bg={_bg} pb="3rem">
      <ProductListSection name="home_a" />
      {/* <BannerFinancing /> */}
      <ProductListSection name="home_b" />
    </Box>
    <Footer />
  </>
);

export default HomePage;
