'use client';

import { NextPage } from 'next';
import { Flex } from 'ui';

import { SideBar, Content, Products } from '../components';

const ProductosPage: NextPage = () => (
  <Flex>
    <SideBar currentPage="productos" />
    <Content>
      <Products />
    </Content>
  </Flex>
);

export default ProductosPage;
