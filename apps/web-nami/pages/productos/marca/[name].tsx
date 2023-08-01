import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useBrandList } from 'shared';
import { Head, ProductsTemplate } from 'ui';
import { NavBar } from '../../../components/NavBar';

const BrandPage: NextPage = () => {
  const { asPath } = useRouter();
  const { data = [] } = useBrandList();
  const brand = data.find(b => b.path === asPath);
  // TODO: when change storeBy this is broken
  return (
    <>
      <Head />
      <NavBar />
      <ProductsTemplate brandId={brand && brand.id} />
    </>
  );
};

export default BrandPage;
