import { Box, Container, Text, Spinner, Flex } from '@chakra-ui/react';
import { useAutopartSearch, useProductSearch } from 'shared';
import { SearchResults } from './SearchResults';

type AutopartsTemplateProps = {
  brandId?: number;
  categoryId?: string;
  text?: string;
  code?: string;
  brandName?: string;
  categoryName?: string;
  modelName?: string;
  pag?: number;
  mode?: string;
};

export const AutopartsTemplate = (props: AutopartsTemplateProps) => {
  const { categoryName, brandName, modelName, text, code } = props;

  // Category search (via api_autoparts)
  const categorySearch = useAutopartSearch({
    categoryName: categoryName || undefined,
    brandName: brandName || undefined,
    modelName: modelName || undefined,
  });

  // Text/code search (via api_ecommerce)
  const textSearch = useProductSearch({
    text: text || code || undefined,
    index: (props.pag || 1) - 1,
  });

  const isCategory = !!(categoryName && brandName && modelName);
  const { isLoading, data, error } = isCategory ? categorySearch : textSearch;

  const results = isCategory
    ? (data as any[] || [])
    : (data as any)?.products || [];

  return (
    <Container maxW="75rem" py="1rem">
      {isLoading && (
        <Flex justifyContent="center" py="3rem">
          <Spinner size="lg" />
        </Flex>
      )}

      {error && (
        <Text color="red.500" textAlign="center" py="2rem">
          Error al buscar productos
        </Text>
      )}

      {!isLoading && results.length === 0 && (
        <Text textAlign="center" py="2rem" color="gray.500">
          No se encontraron resultados
        </Text>
      )}

      {results.length > 0 && (
        <SearchResults results={results} />
      )}
    </Container>
  );
};
