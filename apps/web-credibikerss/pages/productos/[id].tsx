'use client';

import { NextPage } from 'next';
import { Head, ProductDetailTemplate } from 'ui';
import { NavBar } from '../../components';
import { useRouter } from 'next/router';

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
    <>
      <Head />
      <NavBar />
      <ProductDetailTemplate id={id} actions={['quote_request']} />
    </>
  );
};

ProductDetailPage.getInitialProps = async ({ query }) => ({
  id: query.id?.toString(),
});

export default ProductDetailPage;
