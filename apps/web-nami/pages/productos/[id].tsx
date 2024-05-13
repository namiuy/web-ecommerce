import { GaPage, Head, Box, ProductDetailTemplate } from 'ui';
import { NavBar, Footer } from '../../components';
import { useRouter } from 'next/router';
import { NextPage } from 'next';

const ProductDetailPage: NextPage = () => {
  const router = useRouter();
  const id = router.query?.id?.toString();

  if (!id) {
    return <></>;
  }

  return (
    <GaPage page="ProductDetail">
      <>
        <Box>
          <Head />
          <NavBar />
          {/* <ProductDetailTemplate id={id} actions={['add_to_cart']} /> */}
          <ProductDetailTemplate id={id} actions={['whatsapp_request']} />
        </Box>
        <Footer />
      </>
    </GaPage>
  );
};

export default ProductDetailPage;
