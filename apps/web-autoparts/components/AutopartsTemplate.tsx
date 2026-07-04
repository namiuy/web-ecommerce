import { useState, useEffect } from 'react';
import { Container, Text, Spinner, Flex, Button, IconButton, HStack, Tooltip } from '@chakra-ui/react';
import { ChevronLeftIcon, ViewIcon, HamburgerIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/router';
import { useAutopartSearch } from 'shared';
import { SearchResults } from './SearchResults';
import { DimensionsResults } from './DimensionsResults';
import { ListResults } from './ListResults';
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
  dims?: string;
};

function useDimensionsSearch(dimsJson?: string) {
  const [data, setData] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    if (!dimsJson) {
      setData(null);
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      const params = JSON.parse(dimsJson);
      const query = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => {
        if (v) query.set(k, String(v));
      });
      query.set('limit', '50');

      const apiUrl = config.autopartsApiBaseUrl;
      fetch(`${apiUrl}/api/intercambiadores/buscar-dimensiones?${query.toString()}`)
        .then(res => res.json())
        .then(d => setData(Array.isArray(d) ? d : []))
        .catch(e => setError(e))
        .finally(() => setIsLoading(false));
    } catch {
      setError(new Error('Invalid dimensions params'));
      setIsLoading(false);
    }
  }, [dimsJson]);

  return { data, isLoading, error };
}

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

type ViewMode = 'card' | 'list';

export const AutopartsTemplate = (props: AutopartsTemplateProps) => {
  const router = useRouter();
  const { categoryName, brandName, modelName, text, code, dims } = props;
  const [viewMode, setViewMode] = useState<ViewMode>(dims ? 'list' : 'card');

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

  // Dimensions search - direct to api_autoparts
  const dimsSearch = useDimensionsSearch(dims);

  const isCategory = !!(categoryName && brandName && modelName);
  const isCode = !!code;
  const isText = !!text;
  const isDims = !!dims;

  const isLoading = isCategory ? categorySearch.isLoading
    : isDims ? dimsSearch.isLoading
    : (isCode || isText) ? (isCode ? codeSearch : textSearch).isLoading
    : false;

  const error = isCategory ? categorySearch.error
    : isDims ? dimsSearch.error
    : (isCode || isText) ? (isCode ? codeSearch : textSearch).error
    : null;

  const results = isCategory
    ? (categorySearch.data as any[] || [])
    : isDims
    ? (dimsSearch.data || [])
    : isCode
    ? (codeSearch.data || [])
    : (textSearch.data || []);

  const dimsLabel = (() => {
    if (!dims) return '';
    try {
      const p = JSON.parse(dims);
      const parts: string[] = [];
      if (p.tipo_producto) parts.push(`tipo: ${p.tipo_producto}`);
      if (p.marca) parts.push(`marca: ${p.marca}`);
      if (p.alto) parts.push(`alto: ${p.alto}±${p.alto_tolerancia || 2}cm`);
      if (p.ancho) parts.push(`ancho: ${p.ancho}±${p.ancho_tolerancia || 2}cm`);
      if (p.sistema) parts.push(`sistema: ${p.sistema}`);
      if (p.filas) parts.push(`filas: ${p.filas}`);
      return parts.join(', ');
    } catch { return 'Búsqueda por medidas'; }
  })();

  const searchLabel = isCategory
    ? `${categoryName} / ${brandName} / ${modelName}`
    : isDims ? dimsLabel
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
        <>
          {!isDims && (
            <Flex justify="flex-end" mb={3}>
              <HStack spacing={1} bg="gray.100" p={1} borderRadius="md">
                <Tooltip label="Vista tarjetas">
                  <IconButton
                    aria-label="Vista tarjetas"
                    icon={<ViewIcon />}
                    size="sm"
                    variant={viewMode === 'card' ? 'solid' : 'ghost'}
                    colorScheme={viewMode === 'card' ? 'blue' : 'gray'}
                    onClick={() => setViewMode('card')}
                  />
                </Tooltip>
                <Tooltip label="Vista lista">
                  <IconButton
                    aria-label="Vista lista"
                    icon={<HamburgerIcon />}
                    size="sm"
                    variant={viewMode === 'list' ? 'solid' : 'ghost'}
                    colorScheme={viewMode === 'list' ? 'blue' : 'gray'}
                    onClick={() => setViewMode('list')}
                  />
                </Tooltip>
              </HStack>
            </Flex>
          )}
          {isDims
            ? <DimensionsResults results={results} />
            : viewMode === 'list'
            ? <ListResults results={results} />
            : <SearchResults results={results} />
          }
        </>
      )}
    </Container>
  );
};
