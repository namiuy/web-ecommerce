import { useSearchParams } from 'next/navigation';
import { Filters } from './Filters';
import { ProductTable } from './ProductTable';
import { ProductAdd } from './ProductAdd';
import { Search } from './Search';
import { Flex, Text, ProductAddModal } from 'ui';
import { useDisclosure } from '@chakra-ui/react';

export const Products = () => {
  const searchParams = useSearchParams();
  const brandId = searchParams.get('b') ? Number(searchParams.get('b')) : undefined;
  const categoryId = searchParams.get('c') ?? undefined;
  const text = searchParams.get('t') ?? undefined;
  const hasQueryParams = !!brandId || !!categoryId || !!text;
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Text fontSize="1.5rem" fontWeight="medium">
        Productos
      </Text>
      <Flex justifyContent="space-between">
        <Flex gap="1rem">
          <Filters categoryId={categoryId} brandId={brandId} />
          <Search initialValue={text} />
        </Flex>
        <ProductAdd />
      </Flex>
      {hasQueryParams && <ProductTable categoryId={categoryId} brandId={brandId} text={text} />}
      <ProductAddModal isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
    </>
  );
};
