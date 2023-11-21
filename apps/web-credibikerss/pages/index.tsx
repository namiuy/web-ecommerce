'use client';

import { NextPage } from 'next';
import { Banner, Brands, Container, Head, ProductListSection, Box, GaPage } from 'ui';
import { NavBar } from '../components';
//import { BannerFinancing } from '../components/BannerFinancing';
import { Footer } from '../components/Footer';
import { WhatsApp } from '../../../packages/ui/components/WhatsApp';

const _bg = 'brand.background';

const HomePage: NextPage = () => (
  <GaPage page="Home">
    <>
      <Head />
      <NavBar />
      <Container p="0" pb="2rem">
        <Banner section="home_a" />
        <Box m="3rem 2rem">
          <Brands />
        </Box>
      </Container>
      <Box bg={_bg} minH="50vh" pb="3rem">
        <ProductListSection name="home_a" />
        {/* <BannerFinancing /> */}
        <ProductListSection name="home_b" />
      </Box>
      <Footer />
    </>
  </GaPage>
);

export default HomePage;
