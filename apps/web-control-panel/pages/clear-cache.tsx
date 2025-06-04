import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { isBrowser } from 'shared';
import { Button, Flex, Text } from 'ui';

const ClearCachePage: NextPage = () => {
  const issBrowser = isBrowser();
  const router = useRouter();

  useEffect(() => {
    if (issBrowser) {
      const user = lscache.get('user');
      const isUserAdmin =
        user?.roles?.includes('administrator') || user?.roles?.includes('manager') || user?.roles?.includes('seller');

      if (!isUserAdmin) {
        router.push('/iniciar');
      }
    }
  }, [issBrowser, router]);

  const clearCache = () => {
    localStorage.clear();
    sessionStorage.clear();
    router.replace('/');
  };

  return (
    <Flex h="100vh" justifyContent="center" alignItems="center" flexDir="column" gap="1.5rem">
      <Text>Haz clic en el botón para limpiar la caché.</Text>
      <Button onClick={clearCache}>Limpiar</Button>
    </Flex>
  );
};

export default ClearCachePage;
