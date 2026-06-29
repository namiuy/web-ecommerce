import { Box, Text, Flex, Badge, Divider, Wrap, WrapItem } from '@chakra-ui/react';
import { AutopartCard } from 'ui';
import { config } from '../lib/config';

interface SearchResultItem {
  id?: number;
  code?: string;
  description?: string;
  name?: string;
  brand?: string;
  category?: string;
  price?: number;
  model?: string;
  vehicle_type?: string;
  family?: string;
  group_code?: string;
  supplier?: string;
  stock?: number;
}

function mapResultToProduct(result: SearchResultItem) {
  const code = result.code || String(result.id || '');
  const imageBase = code.split(' ')[0];
  const imageUrl = imageBase ? `${config.imagesUrl}/${imageBase}.jpg` : '';

  return {
    id: code,
    name: result.model
      ? `${result.brand || ''} ${result.model}`.trim()
      : result.name || result.description || code,
    description: result.description || '',
    category: { id: result.category || '', name: result.category || '' },
    brand: { id: result.brand || '', name: result.brand || '' },
    price: result.price || 0,
    price_without_tax: (result.price || 0) / 1.22,
    discount: 0,
    image_url: imageUrl,
    images: imageUrl ? [imageUrl] : [],
    path: `/productos/${encodeURIComponent(code)}`,
    stock: 'CO' as const,
    specifications: [],
    related_links: [],
    colors: [],
    is_original: false,
    is_public: true,
    created_at: new Date(),
  };
}

interface SearchResultsProps {
  results: SearchResultItem[];
}

export const SearchResults = ({ results }: SearchResultsProps) => {
  if (results.length === 0) return null;

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={4}>
        <Text fontSize="lg" fontWeight="semibold" color="gray.700">
          Resultados
        </Text>
        <Badge colorScheme="blue" fontSize="md" px={3} py={1} borderRadius="full">
          {results.length}
        </Badge>
      </Flex>

      <Divider mb={4} />

      <Wrap spacing={4} justify={{ base: 'center', md: 'flex-start' }}>
        {results.map((result, index) => {
          const product = mapResultToProduct(result);
          return (
            <WrapItem key={`${product.id}-${index}`}>
              <AutopartCard product={product as any} />
            </WrapItem>
          );
        })}
      </Wrap>
    </Box>
  );
};
