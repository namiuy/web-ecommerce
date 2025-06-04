'use client';

import lscache from 'lscache';
import { NextPage } from 'next';
import { Flex } from 'ui';
import { SideBar, Content, Products } from '../components';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { isBrowser } from 'shared';

const ProductosPage: NextPage = () => {
  const issBrowser = isBrowser();
  const router = useRouter();

  useEffect(() => {
    if (issBrowser) {
      const user = lscache.get('user');
      const isUserAdmin = user?.roles?.includes('administrator') || user?.roles?.includes('manager');

      if (!isUserAdmin) {
        router.push('/');
      }
    }
  }, [issBrowser, router]);

  return (
    <Flex>
      <SideBar currentPage="productos" />
      <Content>
        <Products />
      </Content>
    </Flex>
  );
};

export default ProductosPage;
