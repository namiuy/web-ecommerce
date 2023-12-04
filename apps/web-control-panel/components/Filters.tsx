import { useRouter } from 'next/router';
import { Select } from '@chakra-ui/react';
import { useMemo, useState } from 'react';
import { mapBrandOptions, mapCategoryOptions, useBrandList, useCategoryList } from 'shared';
import { Flex } from 'ui';

type FiltersProps = {
  categoryId?: string;
  brandId?: number;
};

export const Filters = ({ categoryId, brandId }: FiltersProps) => {
  const router = useRouter();
  const { data: categories = [], isLoading: isCategoriesLoading } = useCategoryList();
  const { data: brands = [], isLoading: isBrandsLoading } = useBrandList();

  const selectCategoryOptions = useMemo(() => mapCategoryOptions(categories, router.query), [categories, router.query]);
  const selectBrandOptions = useMemo(() => mapBrandOptions(brands, router.query), [brands, router.query]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === '-1') return;
    const option = selectCategoryOptions.find(c => c.id === e.target.value);
    if (option?.href) router.push(option.href);
  };

  const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === '-1') return;
    const option = selectBrandOptions.find(c => c.id === e.target.value);
    if (option?.href) router.push(option.href);
  };

  return (
    <Flex gap="1rem">
      <Select
        disabled={isCategoriesLoading}
        value={categoryId}
        onChange={handleCategoryChange}
        bg="#f2f2f2"
        borderColor="#f2f2f2"
        maxW="20rem"
      >
        <option value="-1">Seleccione una categoría...</option>
        {selectCategoryOptions.map(({ id, name, parent }, i) => (
          <option key={i} value={id}>
            {parent ? `${parent} | ${name}` : name}
          </option>
        ))}
      </Select>
      <Select
        disabled={isBrandsLoading}
        value={brandId}
        onChange={handleBrandChange}
        bg="#f2f2f2"
        borderColor="#f2f2f2"
        maxW="15rem"
      >
        <option value="-1">Seleccione una marca...</option>
        {selectBrandOptions.map(({ id, name }, i) => (
          <option key={i} value={id}>
            {name}
          </option>
        ))}
      </Select>
    </Flex>
  );
};
