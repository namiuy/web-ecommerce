import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { getProductPropsFromRouter, useBrandList } from 'shared';
import { GaPage, Head, ProductsTemplate } from 'ui';
import { NavBar, Footer } from '../../../components';
import { Brand } from 'shared/entities/brand';

const BrandPage: NextPage = () => {
  const { query } = useRouter();
  const { isLoading, data = [] } = useBrandList();
  const props = getProductPropsFromRouter(query);

  const rawName = typeof query.name === 'string' ? query.name : '';
  const brandName = decodeURIComponent(rawName).trim();
  const brand = data.find((b: Brand) => b.name.trim().toLowerCase() === brandName.toLowerCase());

  return (
    <GaPage page="Brand">
      <>
        <Head />
        <NavBar />
        {!isLoading && brand && <ProductsTemplate {...props} brandId={brand.id} />}
        {!isLoading && !brand && brandName && <ProductsTemplate {...props} />}
        <Footer />
      </>
    </GaPage>
  );
};

export default BrandPage;
