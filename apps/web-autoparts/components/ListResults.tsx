import {
  Box,
  Text,
  Flex,
  Badge,
  Divider,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Image,
  LinkBox,
  LinkOverlay,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { config } from '../lib/config';

interface ListResultItem {
  id?: number;
  code?: string;
  description?: string;
  name?: string;
  price?: number;
  category?: string;
  brand?: string;
  model?: string;
  vehicle_type?: string;
  supplier?: string;
  family?: string;
  group_code?: string;
  stock?: number;
}

interface ListResultsProps {
  results: ListResultItem[];
}

export const ListResults = ({ results }: ListResultsProps) => {
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

      <Box overflowX="auto">
        <Table variant="simple" size="sm">
          <Thead>
            <Tr bg="gray.50">
              <Th></Th>
              <Th>Código</Th>
              <Th>Categoría</Th>
              <Th>Marca</Th>
              <Th>Modelo</Th>
              <Th>Descripción</Th>
              <Th>Proveedor</Th>
              <Th isNumeric>Precio</Th>
            </Tr>
          </Thead>
          <Tbody>
            {results.map((result, index) => {
              const code = result.code || String(result.id || '');
              const imageBase = code.split(' ')[0];
              const imageUrl = imageBase ? `${config.imagesUrl}/${imageBase}.jpg` : '';
              const productPath = `/productos/${encodeURIComponent(code)}`;
              const displayName = result.model
                ? `${result.brand || ''} ${result.model}`.trim()
                : result.name || result.description || '';

              return (
                <LinkBox
                  as={Tr}
                  key={`${code}-${index}`}
                  _hover={{ bg: 'blue.50' }}
                  cursor="pointer"
                  transition="background 0.15s"
                >
                  <Td w="50px" p={1}>
                    <Image
                      src={imageUrl}
                      alt={code}
                      boxSize="40px"
                      objectFit="cover"
                      borderRadius="md"
                      fallback={<Box boxSize="40px" bg="gray.100" borderRadius="md" />}
                    />
                  </Td>
                  <Td>
                    <LinkOverlay as={NextLink} href={productPath}>
                      <Text fontWeight="semibold" fontSize="sm" color="blue.600">
                        {code}
                      </Text>
                    </LinkOverlay>
                    {result.group_code && result.group_code !== code && (
                      <Text fontSize="xs" color="gray.400">{result.group_code}</Text>
                    )}
                  </Td>
                  <Td>
                    <Badge colorScheme="gray" fontSize="xs">{result.category || '-'}</Badge>
                  </Td>
                  <Td fontSize="sm">{result.brand || '-'}</Td>
                  <Td fontSize="sm" maxW="200px" isTruncated>{result.model || '-'}</Td>
                  <Td fontSize="sm" maxW="200px" isTruncated color="gray.600">
                    {displayName || '-'}
                  </Td>
                  <Td fontSize="sm" color="gray.500">{result.supplier || '-'}</Td>
                  <Td isNumeric fontWeight="semibold" fontSize="sm">
                    {result.price ? `$${result.price.toFixed(0)}` : '-'}
                  </Td>
                </LinkBox>
              );
            })}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};
