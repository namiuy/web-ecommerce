'use client';

import { NextPage } from 'next';
import { Flex } from 'ui';

import { SideBar, Content, ProductLists } from '../components';

const ProductListsPage: NextPage = () => {
  return (
    <Flex>
      <SideBar currentPage="listas" />
      <Content>
        <ProductLists />
      </Content>
    </Flex>
  );
};

export default ProductListsPage;
