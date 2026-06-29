import { Container, Text, Spinner, Flex, Button } from '@chakra-ui/react';
import { ChevronLeftIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/router';
import { useAutopartSearch, useProductSearch } from 'shared';
import { useRequest } from 'shared/hooks/request';
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
  const router = useRouter();
  const { categoryName, brandName, modelName, text, code } = props;

  // Category search (tipo > marca > modelo)
  const categorySearch = useAutopartSearch({
    categoryName: categoryName || undefined,
    brandName: brandName || undefined,
    modelName: modelName || undefined,
  });

  // Text search (smart search)
  const textSearch = useProductSearch({
    text: text || undefined,
    index: (props.pag || 1) - 1,
  });

  // Code search (buscar-parcial, much faster)
  const codeSearch = useRequest<{ products: any[] }>(
    code ? `/api/products/code?q=${encodeURIComponent(code)}` : null,
    false,
  );

  const isCategory = !!(categoryName && brandName && modelName);
  const isCode = !!code;

  const activeSearch = isCategory ? categorySearch : isCode ? codeSearch : textSearch;
  const { isLoading, data, error } = activeSearch;

  const results = isCategory
    ? (data as any[] || [])
    : (data as any)?.products || [];

  const searchLabel = isCategory
    ? `${categoryName} / ${brandName} / ${modelName}`
    : text || code || '';

  return (
    <Container maxW="75rem" py="1rem">
      <Flex align="center" mb={4} gap={3}>
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<ChevronLeftIcon boxSize={5} />}
          onClick={() => router.back()}
          color="blue.600"
          _hover={{ bg: 'blue.50' }}
          px={2}
        >
          Volver
        </Button>
        {searchLabel && (
          <Text fontSize="sm" color="gray.500" noOfLines={1}>
            {searchLabel}
          </Text>
        )}
      </Flex>

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

      {!isLoading && !error && results.length === 0 && (
        <Text textAlign="center" py="2rem" color="gray.500">
          No se encontraron resultados
        </Text>
      )}

      {!isLoading && results.length > 0 && (
        <SearchResults results={results} />
      )}
    </Container>
  );
};
