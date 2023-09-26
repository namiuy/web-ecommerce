import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useBrandList } from 'shared';
import { Head, ProductsTemplate } from 'ui';
import { NavBar } from '../../../components/NavBar';
import { Brand } from 'shared/entities/brand';

const BrandPage: NextPage = () => {
  const { asPath } = useRouter();
  const { isLoading, data = [] } = useBrandList();
  const brand = data.find((b: Brand) => b.path === asPath);
  // TODO: when change storeBy this is broken

  return (
    <>
      <Head />
      <NavBar />
      {!isLoading && <ProductsTemplate brandId={brand && brand.id} />}
    </>
  );
};

export default BrandPage;
