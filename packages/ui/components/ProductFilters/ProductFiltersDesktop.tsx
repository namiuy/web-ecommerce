import { Box, Flex, Skeleton, Tag, TagCloseButton, TagLabel, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { ReactNode } from 'react';
import { Brand } from 'shared/entities/brand';
import { Category } from 'shared/entities/category';
import { addSearchParamsToUrl, getProductsUrl, removeSearchParamFromUrl } from 'shared/utils/url';
import { ProductFiltersProps } from '.';
import { isBrowser } from 'shared';

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

type SelectedItemProps = {
  paramKey: string;
  content: string;
};

type ProductFiltersDesktopProps = {
  originalProps: ProductFiltersProps;
  showBrands: boolean;
  showCategories: boolean;
  brandsIsLoading: boolean;
  categoriesIsLoading: boolean;
  selectedBrand?: Brand;
  selectedCategory?: Category;
  brands: Array<Brand>;
  categories: Array<Category>;
};

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
    return <Skeleton w="6rem" h="1rem" mb="1rem" />;
  }

  const url = !isBrowser()
    ? '/'
    : addSearchParamsToUrl(getProductsUrl(), { b: brandId?.toString(), c: categoryId, ...params });

  return (
    <Box as="li" pl={isSecondLevel ? '1rem' : '0'} pb="1rem" pr="1rem" fontSize={_fontSize} lineHeight="1rem">
      <Link href={url}>{content}</Link>
    </Box>
  );
};

const SelectedItem = ({ paramKey, content }: SelectedItemProps) => {
  const url = !isBrowser() ? '/' : removeSearchParamFromUrl(getProductsUrl(), paramKey);

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

export const ProductFiltersDesktop = ({
  originalProps,
  showBrands,
  showCategories,
  brandsIsLoading,
  categoriesIsLoading,
  selectedBrand,
  selectedCategory,
  brands,
  categories,
}: ProductFiltersDesktopProps) => (
  <Flex
    direction="column"
    bg={_backgroundColor}
    borderRightColor={_borderColor}
    p="0 2rem 2rem 2rem"
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
                isLoading={categoriesIsLoading}
                content={name}
                productFiltersProps={originalProps}
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
                productFiltersProps={originalProps}
                params={{ b: id?.toString() }}
              />
            ))}
          </Box>
        )}
      </>
    )}
  </Flex>
);
