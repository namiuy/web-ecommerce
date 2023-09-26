'use client';

import { NextPage } from 'next';
import { AddToCartButton, Head, ProductDetailTemplate } from 'ui';
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
      <ProductDetailTemplate id={id} actions={['add_to_cart']} />
    </>
  );
};

ProductDetailPage.getInitialProps = async ({ query }) => ({
  id: query.id?.toString(),
});

export default ProductDetailPage;
