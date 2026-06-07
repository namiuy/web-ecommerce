import { NextPage } from 'next';
import { Flex } from 'ui';
import { SideBar } from '../components/Sidebar';
import { ProductListManager } from '../components/ProductListManager';

const ListasPage: NextPage = () => (
  <Flex>
    <SideBar currentPage="listas" />
    <Flex flex="1" p="1.5rem" flexDir="column" gap="1rem">
      <ProductListManager />
    </Flex>
  </Flex>
);

export default ListasPage;
