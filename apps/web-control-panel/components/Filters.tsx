import { useRouter } from 'next/router';
import { Select } from '@chakra-ui/react';
import { Flex } from 'ui';
import { useEffect, useMemo, useState } from 'react';
import {
  getProductsUrl,
  mapBrandOptions,
  mapCategoryOptions,
  removeSearchParamFromUrl,
  useBrandList,
  useCategoryList,
} from 'shared';

type FiltersProps = {
  categoryId?: string;
  brandId?: number;
};

export const Filters = ({ categoryId, brandId }: FiltersProps) => {
  const router = useRouter();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>(categoryId);
  const [selectedBrandId, setSelectedBrandId] = useState<number | undefined>(brandId);
  const { data: categories = [], isLoading: isCategoriesLoading } = useCategoryList();
  const { data: brands = [], isLoading: isBrandsLoading } = useBrandList();
  const [availableFilters, setAvailableFilters] = useState<{ brandIds: number[]; categoryIds: string[] } | null>(null);

  const allCategoryOptions = useMemo(() => mapCategoryOptions(categories, router.query), [categories, router.query]);
  const allBrandOptions = useMemo(() => mapBrandOptions(brands, router.query), [brands, router.query]);

  // Fetch available filters when brand or category is selected
  useEffect(() => {
    const activeBrand = brandId || selectedBrandId;
    const activeCategory = categoryId || selectedCategoryId;

    if (activeBrand || activeCategory) {
      const params = new URLSearchParams();
      if (activeBrand) params.append('brand_id', activeBrand.toString());
      if (activeCategory) params.append('category_id', activeCategory);

      fetch(`/api/products/available-filters?${params.toString()}`)
        .then(r => r.json())
        .then(data => setAvailableFilters(data))
        .catch(() => setAvailableFilters(null));
    } else {
      setAvailableFilters(null);
    }
  }, [brandId, selectedBrandId, categoryId, selectedCategoryId]);

  // Filter options based on available filters from backend
  const selectCategoryOptions = useMemo(() => {
    if (availableFilters?.categoryIds?.length && (brandId || selectedBrandId)) {
      return allCategoryOptions.filter(c => availableFilters.categoryIds.includes(c.id));
    }
    return allCategoryOptions;
  }, [allCategoryOptions, availableFilters, brandId, selectedBrandId]);

  const selectBrandOptions = useMemo(() => {
    if (availableFilters?.brandIds?.length && (categoryId || selectedCategoryId)) {
      return allBrandOptions.filter(b => availableFilters.brandIds.includes(Number(b.id)));
    }
    return allBrandOptions;
  }, [allBrandOptions, availableFilters, categoryId, selectedCategoryId]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    let href;
    if (e.target.value === '-1') {
      setSelectedCategoryId(undefined);
      href = removeSearchParamFromUrl(getProductsUrl(), 'c');
    } else {
      const option = selectCategoryOptions.find(c => c.id === e.target.value);
      setSelectedCategoryId(option?.id);
      href = option?.href;
    }
    if (href) router.push(href);
  };

  const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    let href;
    if (e.target.value === '-1') {
      setSelectedBrandId(undefined);
      href = removeSearchParamFromUrl(getProductsUrl(), 'b');
    } else {
      const option = selectBrandOptions.find(c => c.id === e.target.value);
      setSelectedBrandId(option?.id ? Number(option.id) : undefined);
      href = option?.href;
    }
    if (href) router.push(href);
  };

  return (
    <Flex gap="1rem">
      <Select
        disabled={isCategoriesLoading}
        value={selectedCategoryId}
        onChange={handleCategoryChange}
        bg="#f2f2f2"
        borderColor="#f2f2f2"
        maxW="20rem"
      >
        <option value="-1">Seleccione una categoría...</option>
        {selectCategoryOptions.map(({ id, name, parent }, i) => (
          <option key={i} value={id} selected={id === categoryId}>
            {parent ? `${parent} | ${name}` : name}
          </option>
        ))}
      </Select>
      <Select
        disabled={isBrandsLoading}
        value={selectedBrandId}
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
