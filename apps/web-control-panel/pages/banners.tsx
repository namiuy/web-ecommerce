import { NextPage } from 'next';
import { Flex } from 'ui';
import { SideBar } from '../components/Sidebar';
import { BannerManager } from '../components/BannerManager';

const BannersPage: NextPage = () => (
  <Flex>
    <SideBar currentPage="banners" />
    <Flex flex="1" p="1.5rem" flexDir="column" gap="1rem">
      <BannerManager />
    </Flex>
  </Flex>
);

export default BannersPage;
