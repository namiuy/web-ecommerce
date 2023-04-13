'use client';

import { NextPage } from 'next';
import { useBrandList } from 'shared';
import { Container, Head } from 'ui';

const HomePage: NextPage = () => {
  const { isLoading, data } = useBrandList();

  if (isLoading) return <>Loading...</>;

  return (
    <>
      <Head />
      <Container p="0" mb="2rem">
        <ol>
          {data?.map(b => (
            <li key={b.id}>{b.name}</li>
          ))}
        </ol>
      </Container>
    </>
  );
};

export default HomePage;
