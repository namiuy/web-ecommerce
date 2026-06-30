import { useState, useEffect } from 'react';
import { Container, Text, Spinner, Flex, Button } from '@chakra-ui/react';
import { ChevronLeftIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/router';
import { useAutopartSearch } from 'shared';
import { SearchResults } from './SearchResults';
import { config } from '../lib/config';

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

function useDirectSearch(query?: string, type: 'text' | 'code' = 'text') {
  const [data, setData] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    if (!query || query.length < 2) {
      setData(null);
      return;
    }
    setIsLoading(true);
    setError(null);

    if (type === 'code') {
      // Code search via BFF (buscar-parcial, fast)
      fetch(`/api/products/code?q=${encodeURIComponent(query)}`)
        .then(res => res.json())
        .then(d => setData(d.products || []))
        .catch(e => setError(e))
        .finally(() => setIsLoading(false));
    } else {
      // Text search direct to api_autoparts (same as listadearticulos)
      const apiUrl = config.autopartsApiBaseUrl;
      fetch(`${apiUrl}/search/smart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, limit: 50 }),
      })
        .then(res => res.json())
        .then(d => setData(Array.isArray(d) ? d : []))
        .catch(e => setError(e))
        .finally(() => setIsLoading(false));
    }
  }, [query, type]);

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

  // Text search - direct to api_autoparts (no Lambda timeout)
  const textSearch = useDirectSearch(text, 'text');

  // Code search - via BFF (buscar-parcial, fast)
  const codeSearch = useDirectSearch(code, 'code');

  const isCategory = !!(categoryName && brandName && modelName);
  const isCode = !!code;
  const isText = !!text;

  const isLoading = isCategory ? categorySearch.isLoading
    : (isCode || isText) ? (isCode ? codeSearch : textSearch).isLoading
    : false;

  const error = isCategory ? categorySearch.error
    : (isCode || isText) ? (isCode ? codeSearch : textSearch).error
    : null;

  const results = isCategory
    ? (categorySearch.data as any[] || [])
    : isCode
    ? (codeSearch.data || [])
    : (textSearch.data || []);

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
