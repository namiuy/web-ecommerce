import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Box, HStack, Text } from '@chakra-ui/react';
import { SearchForm } from '../components/SearchForm';
import { CategorySearch } from '../components/CategorySearch';

type SearchMode = 'text' | 'code' | 'category';

export const AutopartsSearch = () => {
  const router = useRouter();
  const [searchMode, setSearchMode] = useState<SearchMode>('text');

  // Sync searchMode with URL (only update when URL explicitly specifies mode)
  useEffect(() => {
    if (!router.isReady) return;

    const { mode, catId } = router.query;

    // Only update if mode is explicitly set in URL
    if (mode === 'text' || mode === 'code' || mode === 'category') {
      setSearchMode(mode);
    }
    // Fallback: Infer from catId for backward compatibility (only when no mode param exists)
    else if (catId && typeof catId === 'string') {
      setSearchMode('category');
    }
    // If neither mode nor catId exist, default to text
    else if (!mode && !catId) {
      setSearchMode('text');
    }
  }, [router.isReady, router.query.mode, router.query.catId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearchModeChange = (mode: SearchMode) => {
    setSearchMode(mode);

    const query = { ...router.query };

    // Always set the explicit mode parameter
    query.mode = mode;

    // If switching to text or code mode, clear category params and scroll positions
    if (mode === 'text' || mode === 'code') {
      delete query.catId;
      delete query.subCatId;
      delete query.brand;

      // Clear all scroll positions from sessionStorage
      const keysToRemove: string[] = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && key.startsWith('scroll-')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => sessionStorage.removeItem(key));
    }

    router.replace({ pathname: router.pathname, query }, undefined, { shallow: true });
  };

  const handleSearch = (query: string, limit: number) => {
    router.push(`/productos?t=${encodeURIComponent(query)}`);
  };

  const handleCodeSearch = (query: string, limit: number) => {
    router.push(`/productos?code=${encodeURIComponent(query)}`);
  };

  const handleCategorySearch = (categoryId: string) => {
    router.push(`/productos?c=${encodeURIComponent(categoryId)}`);
  };

  return (
    <Box
      minH="calc(100vh - 158px)"
      w="full"
      display="flex"
      alignItems="flex-start"
      justifyContent="center"
      bgGradient='linear-gradient(180deg, #E3F2FD 0%, #E3F2FD 50%, var(--chakra-colors-white) 80%)'
      px={{ base: 4, md: 8 }}
      pt='4vh'
      transition="background 0.3s ease"
    >
      <Box w={{ base: '100%', lg: '80%' }} mx="auto" maxW="1000px">
        {/* Tabs minimalistas */}
        <HStack spacing={8} justify="center" mb={8}>
          <Box
            position="relative"
            cursor="pointer"
            onClick={() => handleSearchModeChange('text')}
            pb={2}
          >
            <Text
              fontSize="md"
              fontWeight={searchMode === 'text' ? 'semibold' : 'medium'}
              color={searchMode === 'text' ? 'blue.600' : 'gray.500'}
              transition="all 0.2s"
              _hover={{ color: 'blue.600' }}
            >
              Búsqueda por texto
            </Text>
            {searchMode === 'text' && (
              <Box
                position="absolute"
                bottom={0}
                left={0}
                right={0}
                h="2px"
                bg="blue.600"
                borderRadius="full"
              />
            )}
          </Box>

          <Box
            position="relative"
            cursor="pointer"
            onClick={() => handleSearchModeChange('category')}
            pb={2}
          >
            <Text
              fontSize="md"
              fontWeight={searchMode === 'category' ? 'semibold' : 'medium'}
              color={searchMode === 'category' ? 'blue.600' : 'gray.500'}
              transition="all 0.2s"
              _hover={{ color: 'blue.600' }}
            >
              Búsqueda por categoría
            </Text>
            {searchMode === 'category' && (
              <Box
                position="absolute"
                bottom={0}
                left={0}
                right={0}
                h="2px"
                bg="blue.600"
                borderRadius="full"
              />
            )}
          </Box>

          <Box
            position="relative"
            cursor="pointer"
            onClick={() => handleSearchModeChange('code')}
            pb={2}
          >
            <Text
              fontSize="md"
              fontWeight={searchMode === 'code' ? 'semibold' : 'medium'}
              color={searchMode === 'code' ? 'blue.600' : 'gray.500'}
              transition="all 0.2s"
              _hover={{ color: 'blue.600' }}
            >
              Búsqueda por código
            </Text>
            {searchMode === 'code' && (
              <Box
                position="absolute"
                bottom={0}
                left={0}
                right={0}
                h="2px"
                bg="blue.600"
                borderRadius="full"
              />
            )}
          </Box>
        </HStack>

        {/* Content */}
        {searchMode === 'text' ? (
          <Box mt="15vh">
            <SearchForm onSearch={handleSearch} loading={false} />
          </Box>
        ) : searchMode === 'code' ? (
          <Box mt="15vh">
            <SearchForm
              onSearch={handleCodeSearch}
              loading={false}
              title="¿Qué código buscas?"
              subtitle="Codigo Nami, proveedor o original"
              placeholder="Ej: CVW68, DL-A091, 5Z0.121.253.D..."
            />
          </Box>
        ) : (
          <CategorySearch onSearch={handleCategorySearch} loading={false} />
        )}
      </Box>
    </Box>
  );
};
