import lscache from 'lscache';
import { Flex } from 'ui';
import { SideBar, Content, WelcomePanel } from '../components';
import { useEffect } from 'react';
import { isBrowser } from 'shared';
import { useRouter } from 'next/router';

const HomePage = () => {
  const issBrowser = isBrowser();
  const router = useRouter();

  useEffect(() => {
    if (issBrowser) {
      const user = lscache.get('user');
      const isUserAdmin =
        user?.roles?.includes('admin') || user?.roles?.includes('seller');

      if (!isUserAdmin) {
        router.push('/iniciar');
      }
    }
  }, [issBrowser, router]);

  return (
    <Flex>
      <SideBar />
      <Content>
        <WelcomePanel />
      </Content>
    </Flex>
  );
};

export default HomePage;
