'use client';

import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useBrandList } from 'shared';
import { Head } from 'ui';
import ProductsPage from '..';
import { NavBar } from '../../../components';

type BrandPageProps = {
  brandName?: string;
};

const BrandPage: NextPage<BrandPageProps> = ({ brandName }) => {
  const { asPath } = useRouter();
  const { data = [] } = useBrandList();
  const brand = data.find(b => b.path === asPath);
  return <ProductsPage brandId={brand && brand.id} />;
};

BrandPage.getInitialProps = async ({ query }) => {
  const { name } = query;
  return {
    brandName: name?.toString(),
  };
};

export default BrandPage;
