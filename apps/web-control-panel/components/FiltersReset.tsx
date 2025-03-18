import React from 'react';
import { Button } from 'ui';
import { GrPowerReset } from 'react-icons/gr';
import { useRouter } from 'next/router';

export const FiltersReset = () => {
  const router = useRouter();
  const handleReset = () => {
    router.push('/productos');
  };

  return (
    <Button onClick={handleReset} bg="#f2f2f2">
      <GrPowerReset />
    </Button>
  );
};
