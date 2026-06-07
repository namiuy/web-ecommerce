import {
  Box,
  Button,
  Flex,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
  FormControl,
  FormLabel,
  Select,
  TableContainer,
  Tag,
  TagLabel,
  TagCloseButton,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon, AddIcon } from '@chakra-ui/icons';
import { useEffect, useState, useCallback } from 'react';
import lscache from 'lscache';

type ProductListItem = {
  id: number;
  section: string;
  indx: number;
  name: string;
  product_ids: string[];
};

type FormData = {
  id?: number;
  name: string;
  section: string;
  indx: number;
};

const emptyForm: FormData = { name: '', section: 'home_a', indx: 0 };

export const ProductListManager = () => {
  const [lists, setLists] = useState<ProductListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedList, setSelectedList] = useState<ProductListItem | null>(null);
  const [newProductCode, setNewProductCode] = useState('');

  const editDisclosure = useDisclosure();
  const deleteDisclosure = useDisclosure();
  const productsDisclosure = useDisclosure();
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteName, setDeleteName] = useState('');
  const toast = useToast();

  const getToken = () => lscache.get('firebase_token');

  const fetchLists = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = getToken();
      const res = await fetch('/api/product-lists', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        setLists(await res.json());
      }
    } catch (err) {
      console.error('Error fetching lists:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLists();
  }, [fetchLists]);

  const handleAdd = () => {
    const maxIndx = lists.length > 0 ? Math.max(...lists.map(l => l.indx)) : -1;
    setFormData({ ...emptyForm, indx: maxIndx + 1 });
    setIsEditing(false);
    editDisclosure.onOpen();
  };

  const handleEdit = (list: ProductListItem) => {
    setFormData({ id: list.id, name: list.name, section: list.section, indx: list.indx });
    setIsEditing(true);
    editDisclosure.onOpen();
  };

  const handleDeleteClick = (list: ProductListItem) => {
    setDeleteId(list.id);
    setDeleteName(list.name);
    deleteDisclosure.onOpen();
  };

  const handleManageProducts = (list: ProductListItem) => {
    setSelectedList(list);
    setNewProductCode('');
    productsDisclosure.onOpen();
  };

  const apiCall = async (method: string, body: any) => {
    const token = getToken();
    return fetch('/api/product-lists', {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    });
  };

  const handleSave = async () => {
    if (!formData.name) {
      toast({ title: 'El nombre es requerido', status: 'warning', duration: 3000 });
      return;
    }
    setIsSaving(true);
    try {
      const method = isEditing ? 'PUT' : 'POST';
      const res = await apiCall(method, formData);
      if (res.ok) {
        toast({ title: isEditing ? 'Lista actualizada' : 'Lista creada', status: 'success', duration: 3000 });
        editDisclosure.onClose();
        fetchLists();
      } else {
        const err = await res.text();
        toast({ title: 'Error', description: err, status: 'error', duration: 5000 });
      }
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, status: 'error', duration: 5000 });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (deleteId === null) return;
    setIsSaving(true);
    try {
      const res = await apiCall('DELETE', { id: deleteId });
      if (res.ok) {
        toast({ title: 'Lista eliminada', status: 'success', duration: 3000 });
        deleteDisclosure.onClose();
        fetchLists();
      } else {
        const err = await res.text();
        toast({ title: 'Error', description: err, status: 'error', duration: 5000 });
      }
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, status: 'error', duration: 5000 });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddProduct = async () => {
    if (!selectedList || !newProductCode.trim()) return;
    setIsSaving(true);
    try {
      const res = await apiCall('POST', { listId: selectedList.id, productCode: newProductCode.trim() });
      if (res.ok) {
        toast({ title: 'Producto agregado', status: 'success', duration: 2000 });
        setNewProductCode('');
        // Update local state
        setSelectedList({
          ...selectedList,
          product_ids: [...selectedList.product_ids, newProductCode.trim()],
        });
        fetchLists();
      } else {
        const err = await res.text();
        toast({ title: 'Error', description: err, status: 'error', duration: 5000 });
      }
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, status: 'error', duration: 5000 });
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveProduct = async (productCode: string) => {
    if (!selectedList) return;
    try {
      const res = await apiCall('DELETE', { listId: selectedList.id, productCode });
      if (res.ok) {
        toast({ title: 'Producto eliminado de la lista', status: 'success', duration: 2000 });
        setSelectedList({
          ...selectedList,
          product_ids: selectedList.product_ids.filter(p => p !== productCode),
        });
        fetchLists();
      } else {
        const err = await res.text();
        toast({ title: 'Error', description: err, status: 'error', duration: 5000 });
      }
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, status: 'error', duration: 5000 });
    }
  };

  if (isLoading) {
    return (
      <Flex justifyContent="center" alignItems="center" height="10rem">
        <Spinner />
      </Flex>
    );
  }

  return (
    <Box>
      <Flex justifyContent="space-between" alignItems="center" mb="1rem">
        <Text fontSize="1.25rem" fontWeight="bold">Listas de Productos</Text>
        <Button leftIcon={<AddIcon />} colorScheme="primary" size="sm" onClick={handleAdd}>
          Nueva Lista
        </Button>
      </Flex>

      <TableContainer border="1px solid" borderRadius="0.5rem" borderColor="#f2f2f2">
        <Table variant="simple">
          <Thead bg="#f2f2f2">
            <Tr>
              <Th>Orden</Th>
              <Th>Nombre</Th>
              <Th>Sección</Th>
              <Th>Productos</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {lists.length === 0 ? (
              <Tr><Td colSpan={5} textAlign="center" py="2rem">No hay listas configuradas</Td></Tr>
            ) : (
              lists.sort((a, b) => a.indx - b.indx).map((list) => (
                <Tr key={list.id}>
                  <Td textAlign="center">{list.indx}</Td>
                  <Td fontWeight="medium">{list.name}</Td>
                  <Td>{list.section}</Td>
                  <Td>
                    <Button size="xs" variant="outline" onClick={() => handleManageProducts(list)}>
                      {list.product_ids?.length || 0} productos
                    </Button>
                  </Td>
                  <Td>
                    <Flex gap="0.25rem">
                      <IconButton aria-label="Editar" icon={<EditIcon />} variant="ghost" size="sm" onClick={() => handleEdit(list)} />
                      <IconButton aria-label="Eliminar" icon={<DeleteIcon />} variant="ghost" size="sm" colorScheme="red" onClick={() => handleDeleteClick(list)} />
                    </Flex>
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </TableContainer>

      {/* Edit/Create Modal */}
      <Modal isOpen={editDisclosure.isOpen} onClose={editDisclosure.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{isEditing ? 'Editar Lista' : 'Nueva Lista'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex flexDir="column" gap="1rem">
              <FormControl>
                <FormLabel>Nombre</FormLabel>
                <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
              </FormControl>
              <FormControl>
                <FormLabel>Sección</FormLabel>
                <Select value={formData.section} onChange={e => setFormData({ ...formData, section: e.target.value })}>
                  <option value="home_a">Home A (Principal)</option>
                  <option value="home_b">Home B (Secundario)</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Orden</FormLabel>
                <Input type="number" value={formData.indx} onChange={e => setFormData({ ...formData, indx: parseInt(e.target.value) || 0 })} />
              </FormControl>
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Flex gap="0.75rem">
              <Button onClick={editDisclosure.onClose}>Cancelar</Button>
              <Button colorScheme="primary" onClick={handleSave} isLoading={isSaving}>{isEditing ? 'Guardar' : 'Crear'}</Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation */}
      <Modal isOpen={deleteDisclosure.isOpen} onClose={deleteDisclosure.onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Eliminar lista</ModalHeader>
          <ModalCloseButton />
          <ModalBody>¿Eliminar la lista <strong>{deleteName}</strong>?</ModalBody>
          <ModalFooter>
            <Flex gap="0.75rem">
              <Button onClick={deleteDisclosure.onClose}>Cancelar</Button>
              <Button colorScheme="red" onClick={handleDelete} isLoading={isSaving}>Eliminar</Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Manage Products Modal */}
      <Modal isOpen={productsDisclosure.isOpen} onClose={productsDisclosure.onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Productos de: {selectedList?.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex gap="0.5rem" mb="1rem">
              <Input
                placeholder="Código del producto"
                value={newProductCode}
                onChange={e => setNewProductCode(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddProduct()}
              />
              <Button colorScheme="primary" onClick={handleAddProduct} isLoading={isSaving} minW="6rem">
                Agregar
              </Button>
            </Flex>

            {selectedList?.product_ids && selectedList.product_ids.length > 0 ? (
              <Wrap spacing="0.5rem">
                {selectedList.product_ids.map((code) => (
                  <WrapItem key={code}>
                    <Tag size="lg" borderRadius="full" variant="solid" colorScheme="gray">
                      <TagLabel>{code}</TagLabel>
                      <TagCloseButton onClick={() => handleRemoveProduct(code)} />
                    </Tag>
                  </WrapItem>
                ))}
              </Wrap>
            ) : (
              <Text color="gray.500" textAlign="center" py="2rem">No hay productos en esta lista</Text>
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={productsDisclosure.onClose}>Cerrar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};
