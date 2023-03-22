import { Flex, Banner, Container, Head, ProductListSection, Center } from 'ui';
import { NavBar, Categories } from '../components';

export default function Web() {
  return (
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
        </Flex>
      </Container>
    </>
  );
}
