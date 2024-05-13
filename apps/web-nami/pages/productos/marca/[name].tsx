import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useBrandList } from 'shared';
import { GaPage, Head, ProductsTemplate } from 'ui';
import { NavBar, Footer } from '../../../components';
import { Brand } from 'shared/entities/brand';

const BrandPage: NextPage = () => {
  const { asPath } = useRouter();
  const { isLoading, data = [] } = useBrandList();
  const brand = data.find((b: Brand) => b.path === asPath);
  // TODO: when change storeBy this is broken

  return (
    <GaPage page="Brand">
      <>
        <Head />
        <NavBar />
        {!isLoading && <ProductsTemplate brandId={brand && brand.id} />}
        <Footer />
      </>
    </GaPage>
  );
};

export default BrandPage;
