'use client';

import { NextPage } from 'next';
import { Box, Head, ProductDetailTemplate } from 'ui';
import { NavBar } from '../../components';
import { useRouter } from 'next/router';
import { Footer } from '../../components/Footer';

const _backgroundColor = 'brand.productDetail.backgroundColor';

type ProductDetailPageProps = {
  id?: string;
};

const ProductDetailPage: NextPage<ProductDetailPageProps> = ({ id }) => {
  const router = useRouter();

  if (!id) {
    router.replace('/productos');
    return <></>;
  }

  return (
    <Box minHeight="100vh" bg={_backgroundColor}>
      <Head />
      <NavBar />
      <ProductDetailTemplate id={id} actions={['quote_request']} />
      <Box h="6rem" />
      <Footer />
    </Box>
  );
};

ProductDetailPage.getInitialProps = async ({ query }) => ({
  id: query.id?.toString(),
});

export default ProductDetailPage;
