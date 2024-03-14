import { Head, ProductDetailTemplate } from 'ui';
import { NavBar } from '../../components';
import { useRouter } from 'next/router';

const ProductDetailPage = () => {
  const router = useRouter();
  const id = router.query?.id?.toString();

  if (!id) {
    return <></>;
  }

  return (
    <>
      <Head />
      <NavBar />
      {/* <ProductDetailTemplate id={id} actions={['add_to_cart']} /> */}
      <ProductDetailTemplate id={id} actions={['whatsapp_request']} />
    </>
  );
};

export default ProductDetailPage;
