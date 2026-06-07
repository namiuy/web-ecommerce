import {
  Box,
  Button,
  Flex,
  IconButton,
  Image,
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
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon, AddIcon } from '@chakra-ui/icons';
import { useEffect, useState, useCallback } from 'react';
import lscache from 'lscache';
import type { Banner } from 'shared/entities/banner';

type BannerFormData = {
  id?: number;
  section: string;
  indx: number;
  name: string;
  color: string;
  url: string;
  url_mobile: string;
  link: string;
};

const emptyForm: BannerFormData = {
  section: 'home_a',
  indx: 0,
  name: '',
  color: '#383838',
  url: '',
  url_mobile: '',
  link: '',
};

export const BannerManager = () => {
  const [banners, setBanners] = useState<(Banner & { id?: number })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<BannerFormData>(emptyForm);
  const [isEditing, setIsEditing] = useState(false);
  const editDisclosure = useDisclosure();
  const deleteDisclosure = useDisclosure();
  const [deleteBannerId, setDeleteBannerId] = useState<number | null>(null);
  const [deleteBannerName, setDeleteBannerName] = useState('');
  const toast = useToast();

  const fetchBanners = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = lscache.get('firebase_token');
      const res = await fetch('/api/banners', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const data = await res.json();
        setBanners(data);
      }
    } catch (err) {
      console.error('Error fetching banners:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  const handleAdd = () => {
    const maxIndx = banners.length > 0 ? Math.max(...banners.map(b => b.indx)) : -1;
    setFormData({ ...emptyForm, indx: maxIndx + 1 });
    setIsEditing(false);
    editDisclosure.onOpen();
  };

  const handleEdit = (banner: Banner & { id?: number }) => {
    setFormData({
      id: banner.id,
      section: banner.section,
      indx: banner.indx,
      name: banner.name,
      color: banner.color,
      url: banner.url,
      url_mobile: banner.url_mobile,
      link: banner.link || '',
    });
    setIsEditing(true);
    editDisclosure.onOpen();
  };

  const handleDeleteClick = (banner: Banner & { id?: number }) => {
    setDeleteBannerId(banner.id ?? banner.indx);
    setDeleteBannerName(banner.name);
    deleteDisclosure.onOpen();
  };

  const handleSave = async () => {
    if (!formData.name || !formData.url) {
      toast({ title: 'Nombre y URL son requeridos', status: 'warning', duration: 3000 });
      return;
    }

    setIsSaving(true);
    try {
      const token = lscache.get('firebase_token');
      const url = isEditing ? `/api/banners/${formData.id}` : '/api/banners';
      const res = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(isEditing ? { ...formData, id: undefined } : formData),
      });

      if (res.ok) {
        toast({
          title: isEditing ? 'Banner actualizado' : 'Banner creado',
          status: 'success',
          duration: 3000,
        });
        editDisclosure.onClose();
        fetchBanners();
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
    if (deleteBannerId === null) return;
    setIsSaving(true);
    try {
      const token = lscache.get('firebase_token');
      const res = await fetch(`/api/banners/${deleteBannerId}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (res.ok) {
        toast({ title: 'Banner eliminado', status: 'success', duration: 3000 });
        deleteDisclosure.onClose();
        fetchBanners();
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
        <Text fontSize="1.25rem" fontWeight="bold">
          Banners
        </Text>
        <Button leftIcon={<AddIcon />} colorScheme="primary" size="sm" onClick={handleAdd}>
          Agregar Banner
        </Button>
      </Flex>

      <TableContainer border="1px solid" borderRadius="0.5rem" borderColor="#f2f2f2">
        <Table variant="simple">
          <Thead bg="#f2f2f2">
            <Tr>
              <Th>Orden</Th>
              <Th>Nombre</Th>
              <Th>Sección</Th>
              <Th>Preview</Th>
              <Th>Link</Th>
              <Th>Color</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {banners.length === 0 ? (
              <Tr>
                <Td colSpan={7} textAlign="center" py="2rem">
                  No hay banners configurados
                </Td>
              </Tr>
            ) : (
              banners
                .sort((a, b) => a.indx - b.indx)
                .map((banner, i) => (
                  <Tr key={i}>
                    <Td textAlign="center">{banner.indx}</Td>
                    <Td>{banner.name}</Td>
                    <Td>{banner.section}</Td>
                    <Td>
                      <Image
                        src={banner.url}
                        alt={banner.name}
                        maxH="3rem"
                        maxW="8rem"
                        objectFit="contain"
                        fallbackSrc="https://via.placeholder.com/120x48?text=No+Image"
                      />
                    </Td>
                    <Td maxW="10rem" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
                      {banner.link || '-'}
                    </Td>
                    <Td>
                      <Flex alignItems="center" gap="0.5rem">
                        <Box w="1.5rem" h="1.5rem" borderRadius="4px" bg={banner.color} border="1px solid #ccc" />
                        <Text fontSize="0.75rem">{banner.color}</Text>
                      </Flex>
                    </Td>
                    <Td>
                      <Flex gap="0.25rem">
                        <IconButton
                          aria-label="Editar"
                          icon={<EditIcon />}
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(banner)}
                        />
                        <IconButton
                          aria-label="Eliminar"
                          icon={<DeleteIcon />}
                          variant="ghost"
                          size="sm"
                          colorScheme="red"
                          onClick={() => handleDeleteClick(banner)}
                        />
                      </Flex>
                    </Td>
                  </Tr>
                ))
            )}
          </Tbody>
        </Table>
      </TableContainer>

      {/* Edit/Create Modal */}
      <Modal isOpen={editDisclosure.isOpen} onClose={editDisclosure.onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{isEditing ? 'Editar Banner' : 'Nuevo Banner'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex flexDir="column" gap="1rem">
              <FormControl>
                <FormLabel>Nombre</FormLabel>
                <Input
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nombre del banner"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Sección</FormLabel>
                <Select
                  value={formData.section}
                  onChange={e => setFormData({ ...formData, section: e.target.value })}
                >
                  <option value="home_a">Home A (Principal)</option>
                  <option value="home_b">Home B (Secundario)</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Orden</FormLabel>
                <Input
                  type="number"
                  value={formData.indx}
                  onChange={e => setFormData({ ...formData, indx: parseInt(e.target.value) || 0 })}
                />
              </FormControl>
              <FormControl>
                <FormLabel>URL Imagen (Desktop)</FormLabel>
                <Input
                  value={formData.url}
                  onChange={e => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://..."
                />
              </FormControl>
              <FormControl>
                <FormLabel>URL Imagen (Mobile)</FormLabel>
                <Input
                  value={formData.url_mobile}
                  onChange={e => setFormData({ ...formData, url_mobile: e.target.value })}
                  placeholder="https://... (opcional, usa desktop si vacío)"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Link (al hacer click)</FormLabel>
                <Input
                  value={formData.link}
                  onChange={e => setFormData({ ...formData, link: e.target.value })}
                  placeholder="/productos o https://..."
                />
              </FormControl>
              <FormControl>
                <FormLabel>Color de fondo</FormLabel>
                <Flex gap="0.5rem" alignItems="center">
                  <Input
                    type="color"
                    value={formData.color}
                    onChange={e => setFormData({ ...formData, color: e.target.value })}
                    w="3rem"
                    h="2.5rem"
                    p="0.25rem"
                    cursor="pointer"
                  />
                  <Input
                    value={formData.color}
                    onChange={e => setFormData({ ...formData, color: e.target.value })}
                    placeholder="#383838"
                    w="8rem"
                  />
                </Flex>
              </FormControl>

              {formData.url && (
                <Box>
                  <FormLabel>Preview</FormLabel>
                  <Image
                    src={formData.url}
                    alt="Preview"
                    maxH="8rem"
                    objectFit="contain"
                    border="1px solid #eee"
                    borderRadius="0.5rem"
                  />
                </Box>
              )}
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Flex gap="0.75rem">
              <Button onClick={editDisclosure.onClose}>Cancelar</Button>
              <Button colorScheme="primary" onClick={handleSave} isLoading={isSaving}>
                {isEditing ? 'Guardar' : 'Crear'}
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={deleteDisclosure.isOpen} onClose={deleteDisclosure.onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Eliminar banner</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            ¿Estás seguro que deseas eliminar el banner <strong>{deleteBannerName}</strong>?
          </ModalBody>
          <ModalFooter>
            <Flex gap="0.75rem">
              <Button onClick={deleteDisclosure.onClose}>Cancelar</Button>
              <Button colorScheme="red" onClick={handleDelete} isLoading={isSaving}>
                Eliminar
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};
