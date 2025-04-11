import { GaPage, Head, Box, ProductDetailTemplate } from 'ui';
import { NavBar, Footer } from '../../components';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import { cartEnabled } from 'shared';

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
          <ProductDetailTemplate id={id} actions={cartEnabled ? ['add_to_cart'] : ['whatsapp_request']} />
        </Box>
        <Footer />
      </>
    </GaPage>
  );
};

export default ProductDetailPage;
