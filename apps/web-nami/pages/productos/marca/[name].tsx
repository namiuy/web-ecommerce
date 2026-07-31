import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { getProductPropsFromRouter } from 'shared';
import { GaPage, Head, ProductsTemplate } from 'ui';
import { NavBar, Footer } from '../../../components';

const BrandPage: NextPage = () => {
  const { isReady, query } = useRouter();
  const props = getProductPropsFromRouter(query);
  const [brandId, setBrandId] = useState<number | undefined>(undefined);
  const [resolved, setResolved] = useState(false);

  const rawName = typeof query.name === 'string' ? query.name : '';

  useEffect(() => {
    if (!isReady || !rawName) return;

    const brandName = decodeURIComponent(rawName).trim().toLowerCase();

    fetch('/api/brands')
      .then(res => res.json())
      .then(brands => {
        const list = Array.isArray(brands) ? brands : (brands?.data || []);
        const found = list.find((b: any) => (b.name || '').trim().toLowerCase() === brandName);
        setBrandId(found?.id);
        setResolved(true);
      })
      .catch(() => {
        setResolved(true);
      });
  }, [isReady, rawName]);

  return (
    <GaPage page="Brand">
      <>
        <Head />
        <NavBar />
        {resolved && <ProductsTemplate {...props} brandId={brandId} />}
        <Footer />
      </>
    </GaPage>
  );
};

export default BrandPage;
