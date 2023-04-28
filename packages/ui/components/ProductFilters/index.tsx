import { useBreakpointValue } from '@chakra-ui/react';
import { useContext } from 'react';
import { AppContext, getEmptyArray, useBrandList, useCategoryList } from 'shared';
import { Brand } from 'shared/entities/brand';
import { Category } from 'shared/entities/category';
import { ProductFiltersDesktop } from './ProductFiltersDesktop';
import { ProductFiltersMobile } from './ProductFiltersMobile';

const LOADING_BRANDS_LENGTH = 6;
const LOADING_CATEGORIES_LENGTH = 6;

export type ProductFiltersProps = {
  brandId?: number;
  categoryId?: string;
};

const loadBrands = (data: Array<Brand>, filtersBrandIds?: Array<number>): Array<Brand> => {
  return data.filter(b => (filtersBrandIds ? filtersBrandIds.includes(b.id) : b));
};

const loadCategories = (data: Array<Category>, filtersCategoryIds?: Array<string>): Array<Category> => {
  return data
    .map(c => ({
      ...c,
      sub_categories: c.sub_categories ? c.sub_categories : [],
    }))
    .flatMap(c => [c, ...c.sub_categories])
    .map(c => ({
      ...c,
      is_sub_category: c.id.indexOf('.') !== -1,
    }))
    .filter(c => (filtersCategoryIds ? filtersCategoryIds.includes(c.id) : c));
};

export const ProductFilters = (props: ProductFiltersProps) => {
  const {
    productSearchOptions: { filters },
  } = useContext(AppContext);
  const { isLoading: bIsLoading, error: brandsError, data: brandsData = [] } = useBrandList();
  const { isLoading: cIsLoading, error: categoriesError, data: categoriesData = [] } = useCategoryList();

  if (brandsError) console.log(brandsError);
  if (categoriesError) console.log(categoriesError);

  // const brandsIsLoading = bIsLoading || !sf?.brandIds; // TODO:!
  // const categoriesIsLoading = cIsLoading || !sf?.categoryIds; // TODO:!

  const brandsIsLoading = bIsLoading;
  const categoriesIsLoading = cIsLoading;

  const brands = brandsIsLoading
    ? getEmptyArray<Brand>(LOADING_BRANDS_LENGTH)
    : loadBrands(brandsData, filters?.brandIds);

  const categories = categoriesIsLoading
    ? getEmptyArray<Category>(LOADING_CATEGORIES_LENGTH)
    : loadCategories(categoriesData, filters?.categoryIds);

  const selectedBrand = brands.find(b => b.id && b.id === props.brandId);
  const selectedCategory = categories.find(c => c.id && c.id === props.categoryId);

  const showBrands = !!(selectedBrand || brands.length);
  const showCategories = !!(selectedCategory || categories.length);

  const isLg = useBreakpointValue({
    base: false,
    lg: true,
  });

  const NavBarDisplay = isLg ? ProductFiltersDesktop : ProductFiltersMobile;

  return (
    <NavBarDisplay
      {...{
        originalProps: props,
        showBrands,
        showCategories,
        brandsIsLoading,
        categoriesIsLoading,
        selectedBrand,
        selectedCategory,
        brands,
        categories,
      }}
    />
  );
};
