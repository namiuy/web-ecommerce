import {
  Box,
  Grid,
  Card,
  CardBody,
  Text,
  VStack,
  HStack,
  Badge,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Divider,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';

interface SearchResult {
  id: string;
  name: string;
  brand?: string;
  category?: string;
  price?: number;
  score?: number;
}

interface SearchResultsProps {
  results: SearchResult[];
  loading: boolean;
  error: string | null;
}

export const SearchResults = ({ results, loading, error }: SearchResultsProps) => {
  if (loading) {
    return (
      <Box textAlign="center" py={10}>
        <Spinner size="xl" color="blue.500" thickness="4px" />
        <Text mt={4} color="gray.600">
          Buscando productos...
        </Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert
        status="error"
        variant="subtle"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        borderRadius="lg"
        py={8}
      >
        <AlertIcon boxSize="40px" mr={0} />
        <AlertTitle mt={4} mb={1} fontSize="lg">
          Error en la búsqueda
        </AlertTitle>
        <AlertDescription maxWidth="sm">
          {error}
        </AlertDescription>
      </Alert>
    );
  }

  if (results.length === 0) {
    return null;
  }

  return (
    <VStack spacing={4} align="stretch">
      <HStack justify="space-between" align="center">
        <Text fontSize="lg" fontWeight="semibold" color="gray.700">
          Resultados de búsqueda
        </Text>
        <Badge colorScheme="blue" fontSize="md" px={3} py={1} borderRadius="full">
          {results.length} {results.length === 1 ? 'resultado' : 'resultados'}
        </Badge>
      </HStack>

      <Divider />

      <Grid
        templateColumns={{
          base: '1fr',
          md: 'repeat(2, 1fr)',
          lg: 'repeat(3, 1fr)',
        }}
        gap={4}
      >
        {results.map((result) => (
          <Card key={result.id} variant="outline" _hover={{ shadow: 'md' }} transition="all 0.2s">
            <CardBody>
              <VStack align="stretch" spacing={3}>
                <Text fontSize="md" fontWeight="semibold" noOfLines={2}>
                  {result.name}
                </Text>

                {result.brand && (
                  <HStack>
                    <Text fontSize="sm" color="gray.600">
                      Marca:
                    </Text>
                    <Badge colorScheme="purple" variant="subtle">
                      {result.brand}
                    </Badge>
                  </HStack>
                )}

                {result.category && (
                  <HStack>
                    <Text fontSize="sm" color="gray.600">
                      Categoría:
                    </Text>
                    <Badge colorScheme="green" variant="subtle">
                      {result.category}
                    </Badge>
                  </HStack>
                )}

                {result.price !== undefined && (
                  <Text fontSize="lg" fontWeight="bold" color="blue.600">
                    ${result.price.toLocaleString()}
                  </Text>
                )}

                {result.score !== undefined && (
                  <HStack>
                    <Text fontSize="xs" color="gray.500">
                      Relevancia:
                    </Text>
                    <Badge colorScheme="orange" fontSize="xs">
                      {(result.score * 100).toFixed(0)}%
                    </Badge>
                  </HStack>
                )}
              </VStack>
            </CardBody>
          </Card>
        ))}
      </Grid>
    </VStack>
  );
};
