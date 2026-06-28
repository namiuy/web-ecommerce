'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { NextPage } from 'next';

const HomePage: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/productos');
  }, [router]);

  return null;
};

export default HomePage;
