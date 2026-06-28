import { useRouter } from 'next/router';
import { NextPage } from 'next';
import { Head } from 'ui';
import { AutopartsTemplate } from '../../components/AutopartsTemplate';
import { NavBar } from '../../components';
import { getAutopartPropsFromRouter } from 'shared';
import { AutopartsSearch } from '../../components/AutopartsSearch';

type AutopartsPageProps = {
  brandId?: number;
  categoryId?: string;
  text?: string;
  code?: string;
  pag?: number;
};

const AutopartsPage: NextPage<AutopartsPageProps> = () => {
  const { query, isReady } = useRouter();
  const props = getAutopartPropsFromRouter(query);
  const hasQueryParams = !!props?.brandId || !!props?.categoryId || !!props?.brandName || !!props?.categoryName || !!props?.modelName || !!props?.text || !!props?.code;
  
  return (
    <>
      <Head />
      <NavBar />
      {!hasQueryParams ? <AutopartsSearch /> : <AutopartsTemplate {...props} />}
    </>
  );
};

export default AutopartsPage;
