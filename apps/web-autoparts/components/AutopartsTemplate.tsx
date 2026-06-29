import { useState, useEffect } from 'react';
import { Container, Text, Spinner, Flex, Button } from '@chakra-ui/react';
import { ChevronLeftIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/router';
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

function useCodeSearch(code?: string) {
  const [data, setData] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    if (!code || code.length < 3) {
      setData(null);
      return;
    }
    setIsLoading(true);
    setError(null);
    fetch(`/api/products/code?q=${encodeURIComponent(code)}`)
      .then(res => res.json())
      .then(d => setData(d.products || []))
      .catch(e => setError(e))
      .finally(() => setIsLoading(false));
  }, [code]);

  return { data, isLoading, error };
}

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
  const codeSearch = useCodeSearch(code);

  const isCategory = !!(categoryName && brandName && modelName);
  const isCode = !!code;

  const isLoading = isCategory ? categorySearch.isLoading
    : isCode ? codeSearch.isLoading
    : textSearch.isLoading;

  const error = isCategory ? categorySearch.error
    : isCode ? codeSearch.error
    : textSearch.error;

  const results = isCategory
    ? (categorySearch.data as any[] || [])
    : isCode
    ? (codeSearch.data || [])
    : ((textSearch.data as any)?.products || []);

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
