import { useRouter } from 'next/router';
import { NextPage } from 'next';
import { Head } from 'ui';
import { AutopartsTemplate } from '../../components/AutopartsTemplate';
import { NavBar } from '../../components';
import { getAutopartPropsFromRouter } from 'shared';
import { BusquedaTotalSearch } from '../../components/busqueda-total';

const AutopartsPage: NextPage = () => {
  const { query, isReady } = useRouter();

  if (!isReady) {
    return (
      <>
        <Head />
        <NavBar />
      </>
    );
  }

  const props = getAutopartPropsFromRouter(query);
  const hasDimsParams = !!props?.dims;

  return (
    <>
      <Head />
      <NavBar />
      {hasDimsParams ? <AutopartsTemplate {...props} /> : <BusquedaTotalSearch initialQuery={query as Record<string, string>} />}
    </>
  );
};

export default AutopartsPage;
