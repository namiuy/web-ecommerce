import { Box, Flex, Skeleton, Tag, TagCloseButton, TagLabel, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { ReactNode, useContext } from 'react';
import { AppContext, getEmptyArray, useBrandList, useCategoryList } from 'shared';
import { Brand } from 'shared/entities/brand';
import { Category } from 'shared/entities/category';
import { addSearchParamsToUrl, removeSearchParamFromUrl } from 'shared/utils/url';

const LOADING_BRANDS_LENGTH = 6;
const LOADING_CATEGORIES_LENGTH = 6;

const _backgroundColor = 'brand.productFilters.backgroundColor';
const _selectedBackgroundColor = 'brand.productFilters.selected.backgroundColor';
const _selectedColor = 'brand.productFilters.selected.color';
const _borderColor = 'brand.productFilters.borderColor !important';
const _fontSize = '0.875rem';

type TitleProps = {
  children: ReactNode;
};

type ItemProps = {
  isSecondLevel?: boolean;
  isLoading?: boolean;
  content: string;
  productFiltersProps: ProductFiltersProps;
  params: Record<string, string | undefined>;
};

type SelectedItem = {
  paramKey: string;
  content: string;
};

type ProductFiltersProps = {
  brandId?: number;
  categoryId?: string;
};

const getProductsUrl = () => `${window.location.protocol}//${window.location.host}/productos${window.location.search}`;

const Title = ({ children }: TitleProps) => (
  <Text m="0 1rem 1rem 0" fontWeight="bold" fontSize={_fontSize}>
    {children}
  </Text>
);

const Item = ({
  isSecondLevel = false,
  isLoading = false,
  content,
  params,
  productFiltersProps: { brandId, categoryId },
}: ItemProps) => {
  if (isLoading) {
    <Skeleton h="2rem" />;
  }

  const url =
    typeof window === 'undefined'
      ? '/'
      : addSearchParamsToUrl(getProductsUrl(), { b: brandId?.toString(), c: categoryId, ...params });

  return (
    <Box as="li" pl={isSecondLevel ? '1rem' : '0'} pb="1rem" pr="1rem" fontSize={_fontSize} lineHeight="1rem">
      <Link href={url}>{content}</Link>
    </Box>
  );
};

const SelectedItem = ({ paramKey, content }: SelectedItem) => {
  const url = typeof window === 'undefined' ? '/' : removeSearchParamFromUrl(getProductsUrl(), paramKey);

  return (
    <Tag
      variant="solid"
      bg={_selectedBackgroundColor}
      m="0 1rem 1rem 0"
      fontSize={_fontSize}
      height="1rem"
      borderRadius="1rem"
      width="fit-content"
    >
      <TagLabel color={_selectedColor}>{content}</TagLabel>
      <Link href={url}>
        <TagCloseButton color="black" />
      </Link>
    </Tag>
  );
};

const loadBrands = (data: Array<Brand>, filtersBrandIds?: Array<number>): Array<Brand> =>
  data.filter(b => (filtersBrandIds ? filtersBrandIds.includes(b.id) : b));

const loadCategories = (data: Array<Category>, filtersCategoryIds?: Array<string>): Array<Category> =>
  data
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

export const ProductFilters = (props: ProductFiltersProps) => {
  const { productSearchFilters: sf } = useContext(AppContext);

  const { isLoading: brandsIsLoading, error: brandsError, data: brandsData = [] } = useBrandList();
  const { isLoading: categoriesIsLoading, error: categoriesError, data: categoriesData = [] } = useCategoryList();

  if (brandsError) console.log(brandsError);
  if (categoriesError) console.log(categoriesError);

  const brands = brandsIsLoading ? getEmptyArray<Brand>(LOADING_BRANDS_LENGTH) : loadBrands(brandsData, sf?.brandIds);
  const categories = categoriesIsLoading
    ? getEmptyArray<Category>(LOADING_CATEGORIES_LENGTH)
    : loadCategories(categoriesData, sf?.categoryIds);

  const selectedBrand = brands.find(b => b.id === props.brandId);
  const selectedCategory = categories.find(c => c?.id === props.categoryId);

  const showBrands = !!(selectedBrand || brands.length);
  const showCategories = !!(selectedCategory || categories.length);

  return (
    <Flex
      direction="column"
      bg={_backgroundColor}
      borderRightColor={_borderColor}
      borderRight="solid 1px"
      p="2rem"
      minH={{ base: 'calc(calc(100vh - 9rem) - 1px)', lg: 'calc(100vh - 6rem)' }}
    >
      {showCategories && (
        <>
          <Title>Categoria</Title>
          {selectedCategory ? (
            <SelectedItem paramKey="c" content={selectedCategory.name} />
          ) : (
            <Box as="ol" listStyleType="none">
              {categories.map(({ id, name, is_sub_category }, i) => (
                <Item
                  isSecondLevel={is_sub_category}
                  key={i}
                  content={name}
                  productFiltersProps={props}
                  params={{ c: id }}
                />
              ))}
            </Box>
          )}
        </>
      )}
      {showBrands && (
        <>
          <Title>Marca</Title>
          {selectedBrand ? (
            <SelectedItem paramKey="b" content={selectedBrand.name} />
          ) : (
            <Box as="ol" listStyleType="none">
              {brands.map(({ id, name }, i) => (
                <Item
                  key={i}
                  isLoading={brandsIsLoading}
                  content={name}
                  productFiltersProps={props}
                  params={{ b: id?.toString() }}
                />
              ))}
            </Box>
          )}
        </>
      )}
    </Flex>
  );
};
