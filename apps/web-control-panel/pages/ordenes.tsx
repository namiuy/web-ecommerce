'use client';

import { NextPage } from 'next';
import { Flex } from 'ui';

import { SideBar, Content, Orders } from '../components';

const OrdenesPage: NextPage = () => {
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
