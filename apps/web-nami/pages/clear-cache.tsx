import { useRouter } from 'next/router';
import { Button, Flex, Text } from 'ui';

const ClearCachePage: NextPage = () => {
  const router = useRouter();

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
