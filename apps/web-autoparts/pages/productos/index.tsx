import { useRouter } from 'next/router';
import { NextPage } from 'next';
import { Head } from 'ui';
import { AutopartsTemplate } from '../../components/AutopartsTemplate';
import { NavBar } from '../../components';
import { getAutopartPropsFromRouter } from 'shared';
import { AutopartsSearch } from '../../components/AutopartsSearch';

const AutopartsPage: NextPage = () => {
  const { query, isReady } = useRouter();

  // Don't render anything until router is ready to avoid flash
  if (!isReady) {
    return (
      <>
        <Head />
        <NavBar />
      </>
    );
  }

  const props = getAutopartPropsFromRouter(query);
  const hasQueryParams = !!props?.brandId || !!props?.categoryId || !!props?.brandName || !!props?.categoryName || !!props?.modelName || !!props?.text || !!props?.code;

  return (
    <>
      <Head />
      <NavBar />
      {hasQueryParams ? <AutopartsTemplate {...props} /> : <AutopartsSearch />}
    </>
  );
};

export default AutopartsPage;
