import { useState, useEffect, useCallback, Fragment } from 'react';
import {
  Box, Text, Flex, Select, Input, Button, Spinner, Badge, Image,
  Table, Thead, Tbody, Tr, Th, Td, IconButton, Collapse, SimpleGrid,
  HStack, Alert, AlertIcon,
} from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon, ChevronLeftIcon, ChevronRightIcon, SearchIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/router';
import {
  getParqueParts, getParqueAllBrands, getParqueBrandsByPart,
  getParqueModelsByPart, getParqueModelsByBrand, getParqueVehiclesByPart,
  smartSearch, searchByCode, searchByBrandModel,
  getFamiliaById, fetchStockDetail, getImageUrl,
} from '../../lib/services/parque.service';
import type { UnifiedResult, FamiliaMatch, FamiliaProviderRow, PartType } from './types';
import { DimensionsSearch } from '../DimensionsSearch';

const PAGE_SIZE = 40;
const DOLAR_RATE = 43.5;

export const BusquedaTotalSearch = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'vehiculo' | 'dimensiones'>('vehiculo');

  // --- Pieza cascade ---
  const [partTypes, setPartTypes] = useState<PartType[]>([]);
  const [piezaBrands, setPiezaBrands] = useState<string[]>([]);
  const [piezaModels, setPiezaModels] = useState<string[]>([]);
  const [selectedPart, setSelectedPart] = useState('');
  const [selectedPiezaBrand, setSelectedPiezaBrand] = useState('');
  const [selectedPiezaModel, setSelectedPiezaModel] = useState('');
  const [loadingPiezaBrands, setLoadingPiezaBrands] = useState(false);
  const [loadingPiezaModels, setLoadingPiezaModels] = useState(false);

  // --- Text filter ---
  const [filterText, setFilterText] = useState('');

  // --- Codigo ---
  const [familyCode, setFamilyCode] = useState('');

  // --- Results ---
  const [results, setResults] = useState<UnifiedResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchSource, setSearchSource] = useState('');

  // Filter by category
  const [filterCategory, setFilterCategory] = useState('');

  // Pagination
  const [page, setPage] = useState(0);

  // Image preview
  const [hoveredCode, setHoveredCode] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  // Expanded row
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [familiaMatch, setFamiliaMatch] = useState<FamiliaMatch | null>(null);
  const [loadingFamily, setLoadingFamily] = useState(false);

  // Load parts and brands on mount
  useEffect(() => {
    getParqueParts().then(data => setPartTypes(data || [])).catch(() => {});
    getParqueAllBrands().then(data => setPiezaBrands(data || [])).catch(() => {});
  }, []);

  // Reset page when results, filter or text change
  useEffect(() => { setPage(0); }, [results, filterCategory, filterText]);

  // Handle query from URL (initial + NavBar search changes)
  useEffect(() => {
    if (!router.isReady) return;
    const t = router.query.t ? String(router.query.t) : '';
    const code = router.query.code ? String(router.query.code) : '';
    if (t) {
      setFilterText(t);
      doSearch('', '', '', t);
    } else if (code) {
      setFamilyCode(code);
      searchByCodigoFn(code);
    }
  }, [router.query.t, router.query.code]); // eslint-disable-line react-hooks/exhaustive-deps

  // --- Mappers ---
  const mapSmartResults = (data: any[]): UnifiedResult[] => data.map((item: any) => {
    const y1 = item.year_from; const y2 = item.year_to;
    const year = y1 && y2 ? `${y1}-${y2}` : y1 ? `${y1}-` : y2 ? `-${y2}` : (item.ano || '').toString().trim();
    return {
      id: item.id, familyId: item.id,
      code: item.code || '', family: item.family || '', category: item.category || '',
      vehicle: item.model || '', motor: item.vehicle_type || '',
      price: (item.price || 0) * DOLAR_RATE, brand: item.brand || '',
      year, origen: (item.origen || '').trim(),
    };
  });

  const mapVehicleResults = (data: any[], part: string, brand: string): UnifiedResult[] => data.map((item: any) => {
    const y1 = item.ano_inicio; const y2 = item.ano_fin;
    const year = y1 && y2 ? `${y1}-${y2}` : y1 ? `${y1}-` : y2 ? `-${y2}` : (item.ano || '').toString().trim();
    return {
      id: item.id, familyId: item.familia_id,
      code: item.part_code || '', family: item.part_code || '', category: part,
      vehicle: item.modelo || '', motor: item.motor || '', price: 0, brand,
      year, origen: (item.origen || '').trim(),
    };
  });

  const mapBrandModelResults = (data: any[], brand: string): UnifiedResult[] => data.map((item: any) => {
    const y1 = item.year_from; const y2 = item.year_to;
    const year = y1 && y2 ? `${y1}-${y2}` : y1 ? `${y1}-` : y2 ? `-${y2}` : (item.ano || '').toString().trim();
    return {
      id: item.id, familyId: item.id,
      code: item.family || '', family: item.family || '', category: item.category || '',
      vehicle: item.vehicle_name || '', motor: item.vehicle_type || '', price: 0, brand,
      year, origen: (item.origen || '').trim(),
    };
  });

  // --- Search logic ---
  const doSearch = useCallback(async (part: string, brand: string, model: string, text: string) => {
    setLoading(true);
    setError(null);
    setExpandedId(null);
    setFilterCategory('');

    try {
      if (text.trim().length >= 2) {
        setSearchSource(part ? `Texto + ${part}` : 'Texto');
        const data = await smartSearch(text.trim(), 500, part || undefined);
        setResults(mapSmartResults(data || []));
        return;
      }
      if (part && brand) {
        setSearchSource(model ? `${part} / ${brand} / ${model}` : `${part} / ${brand}`);
        const data = await getParqueVehiclesByPart(brand, model, part);
        setResults(mapVehicleResults(data || [], part, brand));
        return;
      }
      if (brand && model) {
        setSearchSource(`${brand} / ${model}`);
        const data = await searchByBrandModel(brand, model);
        setResults(mapBrandModelResults(data || [], brand));
        return;
      }
      if (brand) {
        setSearchSource(brand);
        const data = await smartSearch(brand, 500);
        setResults(mapSmartResults(data || []));
        return;
      }
      if (part) {
        setSearchSource(part);
        const data = await smartSearch(part, 500, part);
        setResults(mapSmartResults(data || []));
        return;
      }
      setResults([]);
      setSearchSource('');
    } catch {
      setError('Error buscando');
      setResults([]);
    } finally { setLoading(false); }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // --- Handlers ---
  const handlePartChange = async (part: string) => {
    setSelectedPart(part);
    if (!part) {
      setSelectedPiezaBrand(''); setSelectedPiezaModel(''); setPiezaModels([]);
      getParqueAllBrands().then(data => setPiezaBrands(data || [])).catch(() => {});
      setResults([]); setSearchSource('');
      return;
    }
    setLoadingPiezaBrands(true);
    try {
      const data = await getParqueBrandsByPart(part);
      setPiezaBrands(data || []);
      if (selectedPiezaBrand && !(data || []).includes(selectedPiezaBrand)) {
        setSelectedPiezaBrand(''); setSelectedPiezaModel(''); setPiezaModels([]);
        doSearch(part, '', '', filterText);
      } else if (selectedPiezaBrand) {
        const models = await getParqueModelsByPart(selectedPiezaBrand, part);
        setPiezaModels(models || []);
        if (selectedPiezaModel && !(models || []).includes(selectedPiezaModel)) {
          setSelectedPiezaModel('');
          doSearch(part, selectedPiezaBrand, '', filterText);
        } else {
          doSearch(part, selectedPiezaBrand, selectedPiezaModel, filterText);
        }
      } else {
        doSearch(part, '', '', filterText);
      }
    } catch { /* ignore */ }
    finally { setLoadingPiezaBrands(false); }
  };

  const handlePiezaBrandChange = async (brand: string) => {
    setSelectedPiezaBrand(brand);
    setSelectedPiezaModel(''); setPiezaModels([]);
    if (!brand) { doSearch(selectedPart, '', '', filterText); return; }
    setLoadingPiezaModels(true);
    try {
      const data = selectedPart
        ? await getParqueModelsByPart(brand, selectedPart)
        : await getParqueModelsByBrand(brand);
      setPiezaModels(data || []);
    } catch { /* ignore */ }
    finally { setLoadingPiezaModels(false); }
    doSearch(selectedPart, brand, '', filterText);
  };

  const handlePiezaModelChange = (model: string) => {
    setSelectedPiezaModel(model);
    doSearch(selectedPart, selectedPiezaBrand, model, filterText);
  };

  const handleSearchButton = () => {
    doSearch(selectedPart, selectedPiezaBrand, selectedPiezaModel, filterText);
  };

  const searchByCodigoFn = async (code?: string) => {
    const c = (code || familyCode).trim();
    if (c.length < 2) return;
    setLoading(true); setError(null); setExpandedId(null); setFilterCategory('');
    setSearchSource('Codigo');
    try {
      const data = await searchByCode(c, 200);
      setResults((data || []).map((item: any) => {
        const y1 = item.year_from; const y2 = item.year_to;
        const year = y1 && y2 ? `${y1}-${y2}` : y1 ? `${y1}-` : y2 ? `-${y2}` : (item.ano || '').toString().trim();
        return {
          id: item.id, familyId: item.id,
          code: item.code || '', family: item.family || '', category: item.category || '',
          vehicle: item.model || '', motor: item.vehicle_type || '',
          price: (item.price || 0) * DOLAR_RATE, brand: item.brand || '',
          year, origen: (item.origen || '').trim(),
        };
      }));
    } catch {
      setError('Error buscando por codigo');
      setResults([]);
    } finally { setLoading(false); }
  };

  // --- Row expansion ---
  const handleRowClick = async (item: UnifiedResult) => {
    const fId = item.familyId || item.id;
    if (expandedId === fId) { setExpandedId(null); setFamiliaMatch(null); return; }
    setExpandedId(fId); setFamiliaMatch(null); setLoadingFamily(true);
    try {
      const familia = await getFamiliaById(fId);
      const proveedores: FamiliaProviderRow[] = (familia.proveedores || []).map((p: any) => ({
        Codigo: p.Codigo || '', Proveedor: p.ProveedorNombre || '',
        PrecioLista: p.PrecioLista || 0, stock: null,
      }));
      const match: FamiliaMatch = {
        IdFamiliaAutoparte: familia.IdFamiliaAutoparte,
        CodigoFamilia: familia.CodigoFamilia || item.family,
        Alto: familia.Alto || null, Ancho: familia.Ancho || null,
        Sistema: familia.Sistema || null, Material: familia.Material || null,
        proveedores,
      };
      setFamiliaMatch(match);
      proveedores.forEach((prov, idx) => {
        if (prov.Codigo) {
          fetchStockDetail(prov.Codigo).then((detail) => {
            setFamiliaMatch(prev => {
              if (!prev) return prev;
              const updated = [...prev.proveedores];
              updated[idx] = { ...updated[idx], stock: detail };
              return { ...prev, proveedores: updated };
            });
          });
        }
      });
    } catch { setFamiliaMatch(null); }
    finally { setLoadingFamily(false); }
  };

  // --- Grouped, filtered, paginated ---
  const categories = Array.from(new Set(results.map(r => r.category).filter(Boolean))).sort();
  const textFilter = filterText.trim().toLowerCase();

  const groupedMap = new Map<number, UnifiedResult>();
  for (const item of results) {
    const key = item.familyId || item.id;
    if (!groupedMap.has(key)) groupedMap.set(key, { ...item });
  }
  const grouped = Array.from(groupedMap.values()).sort((a, b) => {
    const vehCmp = (a.vehicle || '').localeCompare(b.vehicle || '');
    if (vehCmp !== 0) return vehCmp;
    return (a.family || a.code || '').localeCompare(b.family || b.code || '');
  });

  const filteredResults = grouped.filter(item => {
    if (filterCategory && item.category !== filterCategory) return false;
    if (textFilter.length >= 2) {
      const haystack = `${item.code} ${item.family} ${item.category} ${item.vehicle} ${item.brand} ${item.motor}`.toLowerCase();
      if (!haystack.includes(textFilter)) return false;
    }
    return true;
  });
  const totalPages = Math.ceil(filteredResults.length / PAGE_SIZE);
  const pagedResults = filteredResults.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const handleDimensionsSearch = (params: string) => {
    router.push(`/productos?dims=${encodeURIComponent(params)}`);
  };

  return (
    <Box maxW="1400px" mx="auto" p={4}>
      {/* Tab toggle */}
      <HStack mb={4} spacing={0} bg="gray.100" borderRadius="lg" p={1} w="fit-content">
        <Button
          size="sm" borderRadius="md"
          colorScheme={activeTab === 'vehiculo' ? 'blue' : 'gray'}
          variant={activeTab === 'vehiculo' ? 'solid' : 'ghost'}
          onClick={() => setActiveTab('vehiculo')}
        >
          Busqueda por vehiculo
        </Button>
        <Button
          size="sm" borderRadius="md"
          colorScheme={activeTab === 'dimensiones' ? 'blue' : 'gray'}
          variant={activeTab === 'dimensiones' ? 'solid' : 'ghost'}
          onClick={() => setActiveTab('dimensiones')}
        >
          Busqueda por medidas
        </Button>
      </HStack>

      {activeTab === 'dimensiones' ? (
        <DimensionsSearch onSearch={handleDimensionsSearch} loading={false} />
      ) : (
        <>
          {error && (
            <Alert status="error" mb={4} borderRadius="md">
              <AlertIcon />
              {error}
            </Alert>
          )}

          {/* Search form */}
          <Box bg="white" borderRadius="lg" shadow="sm" p={4} mb={4} border="1px solid" borderColor="gray.200">
            <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={3} mb={3}>
              <Box>
                <Text fontSize="xs" fontWeight="bold" mb={1} color="gray.600">Tipo Producto</Text>
                <Select
                  size="sm" value={selectedPart}
                  onChange={(e) => handlePartChange(e.target.value)}
                >
                  <option value="">Todos</option>
                  {partTypes.map(p => <option key={p.id} value={p.label}>{p.label}</option>)}
                </Select>
              </Box>
              <Box>
                <Text fontSize="xs" fontWeight="bold" mb={1} color="gray.600">Marca</Text>
                <Select
                  size="sm" value={selectedPiezaBrand}
                  onChange={(e) => handlePiezaBrandChange(e.target.value)}
                  disabled={loadingPiezaBrands}
                >
                  <option value="">Todas</option>
                  {piezaBrands.map(b => <option key={b} value={b}>{b}</option>)}
                </Select>
              </Box>
              <Box>
                <Text fontSize="xs" fontWeight="bold" mb={1} color="gray.600">Modelo Madre</Text>
                <Select
                  size="sm" value={selectedPiezaModel}
                  onChange={(e) => handlePiezaModelChange(e.target.value)}
                  disabled={!selectedPiezaBrand || loadingPiezaModels}
                >
                  <option value="">Todos</option>
                  {piezaModels.map(m => <option key={m} value={m}>{m}</option>)}
                </Select>
              </Box>
              <Flex gap={1}>
                <Input
                  size="sm" placeholder="Codigo (Nami, proveedor u original...)"
                  value={familyCode}
                  onChange={(e) => setFamilyCode(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') searchByCodigoFn(); }}
                />
                {familyCode.trim().length >= 2 && (
                  <IconButton
                    aria-label="Buscar codigo" icon={<SearchIcon />} size="sm"
                    onClick={() => searchByCodigoFn()}
                  />
                )}
              </Flex>
            </SimpleGrid>

            <HStack spacing={2}>
              <Input
                size="sm" flex={1}
                placeholder="Escribir mas de 2 caracteres para buscar..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSearchButton(); }}
              />
              <Button
                size="sm" colorScheme="blue" minW="120px"
                onClick={handleSearchButton}
                isDisabled={loading || (!selectedPart && filterText.trim().length < 2)}
                leftIcon={loading ? <Spinner size="xs" /> : <SearchIcon />}
              >
                Buscar
              </Button>
            </HStack>
          </Box>

          {/* Loading */}
          {loading && (
            <Flex justify="center" py={8}>
              <Spinner size="lg" color="blue.500" />
            </Flex>
          )}

          {/* Results */}
          {!loading && results.length > 0 && (
            <>
              {/* Filter bar */}
              <Flex
                bg="white" borderRadius="lg" shadow="sm" p={3} mb={4}
                gap={3} align="center" flexWrap="wrap"
                border="1px solid" borderColor="gray.200"
              >
                {searchSource && <Badge colorScheme="blue">{searchSource}</Badge>}
                <Select
                  size="sm" w="200px" placeholder="Tipo Producto"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </Select>
                <Text fontSize="sm" color="gray.500">
                  {filteredResults.length} resultado{filteredResults.length !== 1 ? 's' : ''}
                </Text>
                <Box flex={1} />
                {totalPages > 1 && (
                  <HStack spacing={1}>
                    <IconButton
                      aria-label="Anterior" icon={<ChevronLeftIcon />} size="sm"
                      isDisabled={page === 0} onClick={() => setPage(p => p - 1)}
                    />
                    <Text fontSize="sm">{page + 1} / {totalPages}</Text>
                    <IconButton
                      aria-label="Siguiente" icon={<ChevronRightIcon />} size="sm"
                      isDisabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}
                    />
                  </HStack>
                )}
              </Flex>

              {/* Table + image preview */}
              <Flex gap={4}>
                <Box flex={1} overflowX="auto">
                  <Box
                    bg="white" borderRadius="lg" shadow="sm" overflow="hidden"
                    border="1px solid" borderColor="gray.200" maxH="65vh" overflowY="auto"
                  >
                    <Table size="sm" variant="simple">
                      <Thead position="sticky" top={0} bg="gray.50" zIndex={1}>
                        <Tr>
                          <Th w="40px"></Th>
                          <Th>Tipo</Th>
                          <Th>Codigo</Th>
                          <Th>Familia</Th>
                          <Th>Vehiculo</Th>
                          <Th>Marca</Th>
                          <Th w="30px">Or</Th>
                          <Th>Ano</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {pagedResults.map((item, idx) => {
                          const fId = item.familyId || item.id;
                          return (
                            <Fragment key={`${fId}-${item.code}-${idx}`}>
                              <Tr
                                cursor="pointer"
                                bg={expandedId === fId ? 'blue.50' : hoveredCode === item.code ? 'gray.50' : undefined}
                                _hover={{ bg: expandedId === fId ? 'blue.50' : 'gray.50' }}
                                onMouseEnter={() => { setHoveredCode(item.code); setImageError(false); }}
                                onClick={() => handleRowClick(item)}
                              >
                                <Td>
                                  <IconButton
                                    aria-label="Expandir" size="xs" variant="ghost"
                                    icon={expandedId === fId ? <ChevronUpIcon /> : <ChevronDownIcon />}
                                  />
                                </Td>
                                <Td>
                                  {item.category && (
                                    <Badge fontSize="0.7em" variant="outline" colorScheme="gray">{item.category}</Badge>
                                  )}
                                </Td>
                                <Td>
                                  <Text fontSize="sm" fontWeight="bold" fontFamily="mono">{item.code}</Text>
                                </Td>
                                <Td>
                                  <Text fontSize="sm" fontFamily="mono">{item.family || '-'}</Text>
                                </Td>
                                <Td fontSize="sm">{item.vehicle || '-'}</Td>
                                <Td fontSize="sm">{item.brand || '-'}</Td>
                                <Td>
                                  <Text fontSize="xs" color="gray.500">
                                    {item.origen ? item.origen.substring(0, 2) : ''}
                                  </Text>
                                </Td>
                                <Td fontSize="sm">{item.year || '-'}</Td>
                              </Tr>

                              {/* Expansion row */}
                              <Tr>
                                <Td colSpan={8} p={0} border={expandedId === fId ? undefined : 'none'}>
                                  <Collapse in={expandedId === fId} animateOpacity>
                                    <Box p={4} bg="gray.50">
                                      {loadingFamily ? (
                                        <Flex justify="center" py={4}><Spinner size="sm" /></Flex>
                                      ) : !familiaMatch ? (
                                        <Text fontSize="sm" color="gray.500">
                                          No se encontro una familia para este codigo
                                        </Text>
                                      ) : (
                                        <>
                                          <Flex gap={2} mb={3} flexWrap="wrap" align="center">
                                            <Text fontWeight="bold" fontSize="sm">
                                              Familia: {familiaMatch.CodigoFamilia}
                                            </Text>
                                            {familiaMatch.Alto && <Badge variant="outline">Alto: {familiaMatch.Alto}</Badge>}
                                            {familiaMatch.Ancho && <Badge variant="outline">Ancho: {familiaMatch.Ancho}</Badge>}
                                            {familiaMatch.Sistema && <Badge variant="outline">Sistema: {familiaMatch.Sistema}</Badge>}
                                            {familiaMatch.Material && <Badge variant="outline">Material: {familiaMatch.Material}</Badge>}
                                          </Flex>

                                          {familiaMatch.proveedores.length > 0 ? (
                                            <>
                                              <Text fontSize="sm" fontWeight="bold" mb={2}>
                                                {familiaMatch.proveedores.length} proveedor{familiaMatch.proveedores.length !== 1 ? 'es' : ''}:
                                              </Text>
                                              <Table size="sm" variant="simple">
                                                <Thead>
                                                  <Tr bg="blue.50">
                                                    <Th>Codigo</Th>
                                                    <Th isNumeric>Precio $</Th>
                                                    <Th textAlign="center">Stock</Th>
                                                    <Th></Th>
                                                  </Tr>
                                                </Thead>
                                                <Tbody>
                                                  {familiaMatch.proveedores.map((prov, pIdx) => (
                                                    <Tr key={`${prov.Codigo}-${pIdx}`}>
                                                      <Td>
                                                        <Text fontSize="sm" fontFamily="mono">{prov.Codigo}</Text>
                                                      </Td>
                                                      <Td isNumeric>
                                                        <Text fontSize="sm" fontWeight="bold">
                                                          ${Math.round((prov.PrecioLista || 0) * DOLAR_RATE).toLocaleString()}
                                                        </Text>
                                                      </Td>
                                                      <Td textAlign="center">
                                                        {prov.stock === null ? (
                                                          <Spinner size="xs" />
                                                        ) : (
                                                          <Badge
                                                            colorScheme={prov.stock.total > 0 ? 'green' : 'gray'}
                                                            variant={prov.stock.total > 0 ? 'solid' : 'outline'}
                                                          >
                                                            {prov.stock.total > 0 ? 'Disponible' : 'Consultar'}
                                                          </Badge>
                                                        )}
                                                      </Td>
                                                      <Td>
                                                        <Button
                                                          size="xs" colorScheme="blue" variant="outline"
                                                          onClick={(e) => {
                                                            e.stopPropagation();
                                                            router.push(`/productos/${encodeURIComponent(prov.Codigo.trimEnd())}`);
                                                          }}
                                                        >
                                                          Ver
                                                        </Button>
                                                      </Td>
                                                    </Tr>
                                                  ))}
                                                </Tbody>
                                              </Table>
                                            </>
                                          ) : (
                                            <Text fontSize="sm" color="gray.500">Sin proveedores registrados</Text>
                                          )}
                                        </>
                                      )}
                                    </Box>
                                  </Collapse>
                                </Td>
                              </Tr>
                            </Fragment>
                          );
                        })}
                      </Tbody>
                    </Table>
                  </Box>
                </Box>

                {/* Image preview */}
                {hoveredCode && (
                  <Box w="300px" flexShrink={0} display={{ base: 'none', lg: 'block' }}>
                    <Box
                      bg="white" borderRadius="lg" shadow="sm" p={3}
                      position="sticky" top="80px" textAlign="center"
                      border="1px solid" borderColor="gray.200"
                    >
                      <Text fontSize="xs" color="gray.500" mb={2}>{hoveredCode}</Text>
                      {!imageError ? (
                        <Image
                          src={getImageUrl(hoveredCode)}
                          alt={hoveredCode}
                          onError={() => setImageError(true)}
                          maxW="100%" maxH="300px" objectFit="contain" borderRadius="md"
                        />
                      ) : (
                        <Box py={8} color="gray.300">
                          <Text fontSize="4xl">📷</Text>
                          <Text fontSize="sm" color="gray.400" mt={1}>Sin imagen</Text>
                        </Box>
                      )}
                    </Box>
                  </Box>
                )}
              </Flex>
            </>
          )}

          {/* No results */}
          {!loading && searchSource && results.length === 0 && (
            <Box bg="white" borderRadius="lg" shadow="sm" p={8} textAlign="center" border="1px solid" borderColor="gray.200">
              <Text color="gray.500">No se encontraron resultados</Text>
            </Box>
          )}

          {/* Initial state */}
          {!loading && !searchSource && (
            <Box bg="white" borderRadius="lg" shadow="sm" p={8} textAlign="center" border="1px solid" borderColor="gray.200">
              <Text color="gray.500">
                Busca por pieza, marca, modelo, texto libre o codigo.
              </Text>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};
