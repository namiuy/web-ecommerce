import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { getProductPropsFromRouter, useBrandList } from 'shared';
import { GaPage, Head, ProductsTemplate } from 'ui';
import { NavBar, Footer } from '../../../components';
import { Brand } from 'shared/entities/brand';

const BrandPage: NextPage = () => {
  const { isReady, query } = useRouter();
  const { isLoading, data = [] } = useBrandList();
  const props = getProductPropsFromRouter(query);

  const rawName = typeof query.name === 'string' ? query.name : '';
  const brandName = decodeURIComponent(rawName).trim();

  // Wait for router + brands to be ready before rendering products
  const ready = isReady && !isLoading && data.length > 0;
  const brand = ready
    ? data.find((b: Brand) => b.name.trim().toLowerCase() === brandName.toLowerCase())
    : undefined;

  return (
    <GaPage page="Brand">
      <>
        <Head />
        <NavBar />
        {ready && <ProductsTemplate {...props} brandId={brand?.id} />}
        <Footer />
      </>
    </GaPage>
  );
};

export default BrandPage;
