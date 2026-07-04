import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputRightAddon,
  Select,
  SimpleGrid,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { config } from '../lib/config';

interface DimensionsSearchProps {
  onSearch: (params: string) => void;
  loading: boolean;
}

export const DimensionsSearch = ({ onSearch, loading }: DimensionsSearchProps) => {
  const [tipoProducto, setTipoProducto] = useState('');
  const [marca, setMarca] = useState('');
  const [alto, setAlto] = useState('');
  const [altoTolerancia, setAltoTolerancia] = useState('2');
  const [ancho, setAncho] = useState('');
  const [anchoTolerancia, setAnchoTolerancia] = useState('2');
  const [sistema, setSistema] = useState('');
  const [filas, setFilas] = useState('');

  const [tipos, setTipos] = useState<{ id: number; nombre: string }[]>([]);
  const [marcas, setMarcas] = useState<{ IdMarca: number; Nombre: string }[]>([]);
  const [sistemas, setSistemas] = useState<string[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const apiUrl = config.autopartsApiBaseUrl;

  useEffect(() => {
    const load = async () => {
      setLoadingData(true);
      try {
        const [tiposRes, marcasRes, sistemasRes] = await Promise.all([
          fetch(`${apiUrl}/api/intercambiadores/tipos-producto`).then(r => r.json()),
          fetch(`${apiUrl}/api/marcas`).then(r => r.json()),
          fetch(`${apiUrl}/api/intercambiadores/sistemas`).then(r => r.json()),
        ]);
        setTipos(tiposRes.tipos || []);
        setMarcas(marcasRes.marcas || []);
        setSistemas(sistemasRes.sistemas || []);
      } catch {
        // Si falla, los selects quedan vacíos
      } finally {
        setLoadingData(false);
      }
    };
    load();
  }, [apiUrl]);

  const hayAlgunFiltro = tipoProducto || marca || alto || ancho || sistema || filas;

  const handleSearch = () => {
    if (!hayAlgunFiltro) return;

    const params: Record<string, string> = {};
    if (tipoProducto) params.tipo_producto = tipoProducto;
    if (marca) params.marca = marca;
    if (alto) {
      params.alto = alto.replace(',', '.');
      params.alto_tolerancia = (altoTolerancia || '2').replace(',', '.');
    }
    if (ancho) {
      params.ancho = ancho.replace(',', '.');
      params.ancho_tolerancia = (anchoTolerancia || '2').replace(',', '.');
    }
    if (sistema) params.sistema = sistema;
    if (filas) params.filas = filas;

    onSearch(JSON.stringify(params));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  if (loadingData) {
    return (
      <Flex justify="center" py={10}>
        <Spinner size="lg" />
      </Flex>
    );
  }

  return (
    <VStack spacing={6} align="stretch" w="full">
      <Box textAlign="center">
        <Heading size="lg" color="gray.700" mb={2}>
          Búsqueda por medidas
        </Heading>
        <Text color="gray.500" fontSize="sm">
          Busca intercambiadores por sus dimensiones físicas. Todos los campos son opcionales.
        </Text>
      </Box>

      <Box
        bg="white"
        borderRadius="xl"
        p={6}
        shadow="sm"
        border="1px solid"
        borderColor="gray.100"
      >
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          {/* Tipo de producto */}
          <FormControl>
            <FormLabel fontSize="sm" color="gray.600">Tipo de producto</FormLabel>
            <Select
              placeholder="Todos los tipos"
              value={tipoProducto}
              onChange={(e) => setTipoProducto(e.target.value)}
              bg="gray.50"
              _focus={{ bg: 'white', borderColor: 'blue.400' }}
            >
              {tipos.map((t) => (
                <option key={t.id} value={t.id}>{t.nombre}</option>
              ))}
            </Select>
          </FormControl>

          {/* Marca */}
          <FormControl>
            <FormLabel fontSize="sm" color="gray.600">Marca de vehículo</FormLabel>
            <Select
              placeholder="Todas las marcas"
              value={marca}
              onChange={(e) => setMarca(e.target.value)}
              bg="gray.50"
              _focus={{ bg: 'white', borderColor: 'blue.400' }}
            >
              {marcas.map((m) => (
                <option key={m.IdMarca} value={m.Nombre}>{m.Nombre}</option>
              ))}
            </Select>
          </FormControl>

          {/* Alto */}
          <FormControl>
            <FormLabel fontSize="sm" color="gray.600">Alto (cm)</FormLabel>
            <HStack>
              <InputGroup>
                <Input
                  placeholder="ej: 55"
                  value={alto}
                  onChange={(e) => setAlto(e.target.value)}
                  onKeyDown={handleKeyDown}
                  bg="gray.50"
                  _focus={{ bg: 'white', borderColor: 'blue.400' }}
                />
                <InputRightAddon>cm</InputRightAddon>
              </InputGroup>
              <InputGroup maxW="100px">
                <Input
                  placeholder="2"
                  value={altoTolerancia}
                  onChange={(e) => setAltoTolerancia(e.target.value)}
                  onKeyDown={handleKeyDown}
                  bg="gray.50"
                  textAlign="center"
                  _focus={{ bg: 'white', borderColor: 'blue.400' }}
                />
                <InputRightAddon>±</InputRightAddon>
              </InputGroup>
            </HStack>
          </FormControl>

          {/* Ancho */}
          <FormControl>
            <FormLabel fontSize="sm" color="gray.600">Ancho (cm)</FormLabel>
            <HStack>
              <InputGroup>
                <Input
                  placeholder="ej: 38"
                  value={ancho}
                  onChange={(e) => setAncho(e.target.value)}
                  onKeyDown={handleKeyDown}
                  bg="gray.50"
                  _focus={{ bg: 'white', borderColor: 'blue.400' }}
                />
                <InputRightAddon>cm</InputRightAddon>
              </InputGroup>
              <InputGroup maxW="100px">
                <Input
                  placeholder="2"
                  value={anchoTolerancia}
                  onChange={(e) => setAnchoTolerancia(e.target.value)}
                  onKeyDown={handleKeyDown}
                  bg="gray.50"
                  textAlign="center"
                  _focus={{ bg: 'white', borderColor: 'blue.400' }}
                />
                <InputRightAddon>±</InputRightAddon>
              </InputGroup>
            </HStack>
          </FormControl>

          {/* Sistema */}
          <FormControl>
            <FormLabel fontSize="sm" color="gray.600">Sistema</FormLabel>
            <Select
              placeholder="Todos los sistemas"
              value={sistema}
              onChange={(e) => setSistema(e.target.value)}
              bg="gray.50"
              _focus={{ bg: 'white', borderColor: 'blue.400' }}
            >
              {sistemas.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </Select>
          </FormControl>

          {/* Filas */}
          <FormControl>
            <FormLabel fontSize="sm" color="gray.600">Filas</FormLabel>
            <Input
              placeholder="ej: 2"
              value={filas}
              onChange={(e) => setFilas(e.target.value)}
              onKeyDown={handleKeyDown}
              bg="gray.50"
              _focus={{ bg: 'white', borderColor: 'blue.400' }}
            />
          </FormControl>
        </SimpleGrid>

        <Flex justify="center" mt={6}>
          <Button
            colorScheme="blue"
            size="lg"
            leftIcon={loading ? <Spinner size="sm" /> : <SearchIcon />}
            onClick={handleSearch}
            isDisabled={loading || !hayAlgunFiltro}
            px={10}
          >
            Buscar
          </Button>
        </Flex>
      </Box>
    </VStack>
  );
};
