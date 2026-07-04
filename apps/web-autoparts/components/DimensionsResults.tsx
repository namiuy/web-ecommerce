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

interface DimensionsResultItem {
  id?: number;
  code?: string;
  description?: string;
  price?: number;
  alto?: string;
  ancho?: string;
  sistema?: string;
  aletas?: string;
  filas?: string;
  category?: string;
  brand?: string;
  supplier?: string;
  family?: string;
  group_code?: string;
}

interface DimensionsResultsProps {
  results: DimensionsResultItem[];
}

export const DimensionsResults = ({ results }: DimensionsResultsProps) => {
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
              <Th>Alto</Th>
              <Th>Ancho</Th>
              <Th>Sistema</Th>
              <Th>Filas</Th>
              <Th>Marca</Th>
              <Th>Proveedor</Th>
              <Th isNumeric>Precio</Th>
            </Tr>
          </Thead>
          <Tbody>
            {results.map((item, index) => {
              const code = item.code || String(item.id || '');
              const imageBase = code.split(' ')[0];
              const imageUrl = imageBase ? `${config.imagesUrl}/${imageBase}.jpg` : '';
              const productPath = `/productos/${encodeURIComponent(code)}`;

              return (
                <LinkBox
                  as={Tr}
                  key={`${item.id}-${index}`}
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
                    {item.group_code && item.group_code !== code && (
                      <Text fontSize="xs" color="gray.400">{item.group_code}</Text>
                    )}
                  </Td>
                  <Td>
                    <Badge colorScheme="gray" fontSize="xs">{item.category || '-'}</Badge>
                  </Td>
                  <Td fontSize="sm">{item.alto || '-'}</Td>
                  <Td fontSize="sm">{item.ancho || '-'}</Td>
                  <Td fontSize="sm">{item.sistema || '-'}</Td>
                  <Td fontSize="sm">{item.filas || '-'}</Td>
                  <Td fontSize="sm">{item.brand || '-'}</Td>
                  <Td fontSize="sm" color="gray.500">{item.supplier || '-'}</Td>
                  <Td isNumeric fontWeight="semibold" fontSize="sm">
                    {item.price ? `$${item.price.toFixed(0)}` : '-'}
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
