import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { getProductPropsFromRouter, useBrandList } from 'shared';
import { GaPage, Head, ProductsTemplate } from 'ui';
import { NavBar, Footer } from '../../../components';
import { Brand } from 'shared/entities/brand';

const BrandPage: NextPage = () => {
  const { asPath, query } = useRouter();
  const { isLoading, data = [] } = useBrandList();
  const props = getProductPropsFromRouter(query);
  const brand = data.find((b: Brand) => asPath.includes(b.path));

  return (
    <GaPage page="Brand">
      <>
        <Head />
        <NavBar />
        {!isLoading && <ProductsTemplate {...props} brandId={brand && brand.id} />}
        <Footer />
      </>
    </GaPage>
  );
};

export default BrandPage;
