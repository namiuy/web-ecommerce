import { GaPage, Head, Box } from 'ui';
import { NavBar, Footer } from '../../components';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import { getCartEnabled } from 'shared';
const cartEnabled = getCartEnabled();
import { AutopartDetailTemplate } from '../../components/AutopartDetailTemplate';

const AutopartDetailPage: NextPage = () => {
  const router = useRouter();
  const id = router.query?.id?.toString();

  if (!id) {
    return <></>;
  }

  return (
    <GaPage page="ProductDetail">
      <>
        <Box>
          <Head />
          <NavBar />
          <AutopartDetailTemplate id={id} actions={cartEnabled ? ['add_to_cart'] : ['whatsapp_request']} />
        </Box>
        <Footer />
      </>
    </GaPage>
  );
};

export default AutopartDetailPage;