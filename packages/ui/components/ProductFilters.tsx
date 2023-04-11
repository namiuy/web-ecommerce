import { Box, Flex, Skeleton, Tag, TagCloseButton, TagLabel, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { ReactNode } from 'react';
import { getEmptyArray, useBrandList, useCategoryList } from 'shared';
import { Brand } from 'shared/entities/brand';
import { Category } from 'shared/entities/category';
import { addSearchParamsToUrl } from 'shared/utils/url';

const LOADING_BRANDS_LENGTH = 6;
const LOADING_CATEGORIES_LENGTH = 6;

const _backgroundColor = 'brand.productFilters.backgroundColor';
const _borderColor = 'brand.productFilters.borderColor !important';
const _fontSize = '0.875rem';

type TitleProps = {
  children: ReactNode;
};

type ItemProps = {
  isSecondLevel?: boolean;
  isLoading?: boolean;
  content: string;
  params: Record<string, string | undefined>;
};

type SelectedItem = {
  content: string;
};

type ProductFiltersProps = {
  brandId?: number;
  categoryId?: string;
};

const Title = ({ children }: TitleProps) => (
  <Text m="0 1rem 1rem 0" fontWeight="bold" fontSize={_fontSize}>
    {children}
  </Text>
);

const Item = ({ isSecondLevel = false, isLoading = false, content, params }: ItemProps) => {
  if (isLoading) {
    <Skeleton h="2rem" />;
  }

  const url = typeof window === 'undefined' ? '/' : addSearchParamsToUrl(window.location.href, params);

  return (
    <Box as="li" pl={isSecondLevel ? '2rem' : '1rem'} pb="1rem" pr="1rem" fontSize={_fontSize} lineHeight="1rem">
      <Link href={url}>{content}</Link>
    </Box>
  );
};

const SelectedItem = ({ content }: SelectedItem) => (
  <Tag variant="solid" colorScheme="green">
    <TagLabel>{content}</TagLabel>
    <TagCloseButton />
  </Tag>
);

export const ProductFilters = ({ brandId, categoryId }: ProductFiltersProps) => {
  const { isLoading: brandsIsLoading, error: brandsError, data: brandsData = [] } = useBrandList();
  const { isLoading: categoriesIsLoading, error: categoriesError, data: categoriesData = [] } = useCategoryList();

  if (brandsError) console.log(brandsError);
  if (categoriesError) console.log(categoriesError);

  const brands = brandsIsLoading ? getEmptyArray<Brand>(LOADING_BRANDS_LENGTH) : brandsData;
  const categories = categoriesIsLoading ? getEmptyArray<Category>(LOADING_CATEGORIES_LENGTH) : categoriesData;

  const selectedCategory = categories.flatMap(c => c.subCategories).find(c => c?.id === categoryId);

  return (
    <Flex
      as="ol"
      direction="column"
      bg={_backgroundColor}
      borderRightColor={_borderColor}
      borderRight="solid 1px"
      p="2rem"
      listStyleType="none"
    >
      <Title>Categoria</Title>
      {selectedCategory ? (
        <SelectedItem content={selectedCategory.name} />
      ) : (
        categories.map(({ id, name, subCategories }, i) => (
          <>
            <Item key={i} isLoading={categoriesIsLoading} content={name} params={{ c: id }} />
            {subCategories?.map(({ id, name }, ii) => (
              <Item isSecondLevel={true} key={ii} content={name} params={{ c: id }} />
            ))}
          </>
        ))
      )}
      <Title>Marca</Title>
      {brands.map(({ id, name }, i) => (
        <Item key={i} isLoading={brandsIsLoading} content={name} params={{ b: id.toString() }} />
      ))}
    </Flex>
  );
};
