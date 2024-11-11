import lscache from 'lscache';
import { Flex } from 'ui';
import { SideBar, Content, WelcomePanel } from '../components';
import { useEffect, useState } from 'react';
import { isBrowser } from 'shared';
import { useRouter } from 'next/router';

const HomePage = () => {
  const issBrowser = isBrowser();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (issBrowser) {
      const user = lscache.get('user'); // TODO: improve this
      const isUserAdmin = user?.roles?.includes('admin') || user?.roles?.includes('seller'); // TODO: improve this

      if (isUserAdmin) {
        setIsLoading(false);
      } else {
        router.push('/iniciar');
      }
    }
  }, [issBrowser]);

  if (isLoading) {
    return <></>;
  }

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
