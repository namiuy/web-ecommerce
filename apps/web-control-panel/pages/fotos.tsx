import lscache from 'lscache';
import { NextPage } from 'next';
import { Flex } from 'ui';
import { SideBar, Content, PhotosUpload } from '../components';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { isBrowser } from 'shared';

const FotosPage: NextPage = () => {
  const issBrowser = isBrowser();
  const router = useRouter();

  useEffect(() => {
    if (issBrowser) {
      const user = lscache.get('user');
      const isUserImageUploader = user?.roles?.includes('admin') || user?.roles?.includes('imageuploader');

      if (!isUserImageUploader) {
        router.push('/');
      }
    }
  }, [issBrowser]);

  return (
    <Flex>
      <SideBar currentPage="fotos" />
      <Content>
        <PhotosUpload />
      </Content>
    </Flex>
  );
};

export default FotosPage;
