import { useSearchParams } from 'next/navigation';
import { Filters } from './Filters';
import { ProductTable } from './ProductTable';
import { ProductAdd } from './ProductAdd';
import { Search } from './Search';
import { Flex, Text } from 'ui';
import { FiltersReset } from './FiltersReset';

export const Products = () => {
  const searchParams = useSearchParams();
  const brandId = searchParams.get('b') ? Number(searchParams.get('b')) : undefined;
  const categoryId = searchParams.get('c') ?? undefined;
  const text = searchParams.get('t') ?? undefined;

  return (
    <>
      <Text fontSize="1.5rem" fontWeight="medium">
        Productos
      </Text>
      <Flex justifyContent="space-between">
        <Flex gap="1rem">
          <Filters categoryId={categoryId} brandId={brandId} />
          <Search initialValue={text} />
          <FiltersReset />
        </Flex>
        <ProductAdd />
      </Flex>
      <ProductTable categoryId={categoryId} brandId={brandId} text={text} />
    </>
  );
};
