'use client';

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
      const user = lscache.get('user'); // TODO: improve this
      const isUserAdmin =
        user?.roles?.includes('administrator') || user?.roles?.includes('manager') || user?.roles?.includes('seller'); // TODO: improve this

      if (!isUserAdmin) {
        router.push('/iniciar');
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
