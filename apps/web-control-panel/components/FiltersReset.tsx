import { Button } from 'ui';
import { useRouter } from 'next/router';
import { GrPowerReset } from 'react-icons/gr';

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
