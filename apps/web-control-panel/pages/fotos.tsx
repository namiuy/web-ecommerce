'use client';

import lscache from 'lscache';
import { NextPage } from 'next';
import { Flex } from 'ui';
import { SideBar, Content, Products, PhotosUpload } from '../components';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { isBrowser } from 'shared';

const FotosPage: NextPage = () => {
  const issBrowser = isBrowser();
  const router = useRouter();

  useEffect(() => {
    if (issBrowser) {
      const user = lscache.get('user');
      const isUserAdmin =
        user?.roles?.includes('administrator') || user?.roles?.includes('manager') || user?.roles?.includes('seller');

      if (!isUserAdmin) {
        router.push('/iniciar');
      }
    }
  }, [issBrowser]);

  return (
    <Flex>
      <SideBar currentPage="fotos" />
      <Content>
        <PhotosUpload />
      </Content>
    </Flex>
  );
};

export default FotosPage;
