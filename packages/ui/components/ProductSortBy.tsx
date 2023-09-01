import { Flex, Text, Select } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { ChangeEvent, useContext } from 'react';
import { addSearchParamsToUrl, AppContext, getProductsUrl, isBrowser } from 'shared';
import { ProductSearchSortBy } from 'shared/entities/product-search';

export const ProductSortBy = () => {
  const router = useRouter();
  const {
    productSearchOptions: { sortBy },
  } = useContext(AppContext);

  const handleOnChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const url = !isBrowser()
      ? '/'
      : addSearchParamsToUrl(getProductsUrl(), { s: e.target.value as ProductSearchSortBy });

    router.push(url);
  };

  return (
    <Flex align="center">
      <Text fontSize="xs" pr=".5rem">
        Ordernar por:
      </Text>
      <Select width="auto" size="xs" value={sortBy} onChange={handleOnChange}>
        <option value="rel">Más relevantes</option>
        <option value="plo">Menor precio</option>
        <option value="phi">Mayor precio</option>
      </Select>
    </Flex>
  );
};
