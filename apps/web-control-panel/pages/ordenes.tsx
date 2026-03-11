'use client';

import lscache from 'lscache';
import { NextPage } from 'next';
import { Flex } from 'ui';
import { SideBar, Content, Orders } from '../components';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { isBrowser } from 'shared';

const OrdenesPage: NextPage = () => {
  const issBrowser = isBrowser();
  const router = useRouter();

  useEffect(() => {
    if (issBrowser) {
      const user = lscache.get('user');
      const isUserAdmin =
        user?.roles?.includes('admin') || user?.roles?.includes('seller');

      if (!isUserAdmin) {
        router.push('/');
      }
    }
  }, [issBrowser]);

  return (
    <Flex>
      <SideBar currentPage="ordenes" />
      <Content>
        <Orders />
      </Content>
    </Flex>
  );
};

export default OrdenesPage;
