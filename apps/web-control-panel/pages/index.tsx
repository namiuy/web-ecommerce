'use client';

import { NextPage } from 'next';
import { Flex, Text } from 'ui';

import { SideBar, Content, WelcomePanel } from '../components';

const ProductListsPage: NextPage = () => (
  <Flex>
    <SideBar />
    <Content>
      <WelcomePanel />
    </Content>
  </Flex>
);

export default ProductListsPage;
