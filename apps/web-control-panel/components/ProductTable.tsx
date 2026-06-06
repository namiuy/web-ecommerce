import {
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  IconButton,
  useDisclosure,
  useToast,
  Image,
  Spinner,
  Checkbox,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
} from '@chakra-ui/react';
import { EditIcon, ViewIcon, DeleteIcon } from '@chakra-ui/icons';
import { useProductSearch } from 'shared';
import { Box, Flex, Text, ImageModal, ProductEditModal } from 'ui';
import { useState, useCallback } from 'react';
import { Product } from 'shared/entities/product';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import lscache from 'lscache';

type ProductTableProps = {
  categoryId?: string;
  brandId?: number;
  text?: string;
};

export const ProductTable = ({ categoryId, brandId, text }: ProductTableProps) => {
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 12;
  const { isLoading, error, data } = useProductSearch({ categoryId, brandId, text, index: pageIndex });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const imageDisclosure = useDisclosure();
  const detailDisclosure = useDisclosure();
  const deleteDisclosure = useDisclosure();
  const [product, setProduct] = useState<Product>();
  const [detailProduct, setDetailProduct] = useState<Product>();
  const [deleteProduct, setDeleteProduct] = useState<Product>();
  const [imageSrc, setImageSrc] = useState<string>();
  const [isDeleting, setIsDeleting] = useState(false);
  const toast = useToast();

  const handleViewDetail = useCallback(async (product: Product) => {
    try {
      const token = lscache.get('firebase_token');
      const res = await fetch(`/api/products/${encodeURIComponent(product.id)}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const fullProduct = await res.json();
        setDetailProduct(fullProduct);
      } else {
        setDetailProduct(product);
      }
    } catch {
      setDetailProduct(product);
    }
    detailDisclosure.onOpen();
  }, [detailDisclosure]);

  const handleDeleteClick = useCallback((product: Product) => {
    setDeleteProduct(product);
    deleteDisclosure.onOpen();
  }, [deleteDisclosure]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteProduct) return;
    setIsDeleting(true);
    try {
      // Instead of deleting, mark as not public to preserve order history
      const { put } = await import('shared/utils/fetcher');
      await put(`/api/products/${encodeURIComponent(deleteProduct.id)}`, {
        body: JSON.stringify({ is_public: false }),
      }, true);
      toast({ title: 'Producto desactivado', description: 'El producto ya no es visible al público', status: 'success', duration: 3000 });
      deleteDisclosure.onClose();
      window.location.reload();
    } catch (err: any) {
      toast({ title: 'Error al desactivar', description: err.message, status: 'error', duration: 5000 });
    } finally {
      setIsDeleting(false);
    }
  }, [deleteProduct, deleteDisclosure, toast]);

  const handleEdit = useCallback(async (product: Product) => {
    // Load full product with specifications and related_links from BFF
    try {
      const token = lscache.get('firebase_token');
      const res = await fetch(`/api/products/${encodeURIComponent(product.id)}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const fullProduct = await res.json();
        setProduct({ ...fullProduct, colors: fullProduct.colors ?? [] });
      } else {
        setProduct({ ...product, colors: product.colors ?? [] });
      }
    } catch {
      setProduct({ ...product, colors: product.colors ?? [] });
    }
    onOpen();
  }, [onOpen]);

  const handleImage = (src: string) => {
    setImageSrc(src);
    imageDisclosure.onOpen();
  };

  const getProductMainImage = (product: Product): string => {
    if (product.multimedias && product.multimedias.length > 0) {
      const firstPhoto = product.multimedias.find(m => m.type === 'photo');
      if (firstPhoto) return firstPhoto.url;
    }

    if (product.images && product.images.length > 0) {
      return product.images[0];
    }

    return './placeholder.jpg';
  };

  const hasVideo = (product: Product): boolean => {
    return product.multimedias?.some(m => m.type === 'video') ?? false;
  };

  const getMediaCount = (product: Product): number => {
    if (product.multimedias) {
      return product.multimedias.length;
    }
    if (product.images) {
      return product.images.length;
    }
    return 0;
  };

  const handleNextPage = () => {
    if (data?.products && data.products.length === pageSize) {
      setPageIndex(prev => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (pageIndex > 0) {
      setPageIndex(prev => prev - 1);
    }
  };

  if (error) {
    console.log(error);
  }

  if (isLoading) {
    return (
      <Flex justifyContent="center" alignItems="center" height="10rem">
        <Spinner />
      </Flex>
    );
  }

  if (!categoryId && !brandId && !text) {
    return (
      <Flex justifyContent="center" alignItems="center" height="10rem">
        <Text>Seleccione un filtro...</Text>
      </Flex>
    );
  }

  if (data?.products?.length === 0) {
    return (
      <Flex justifyContent="center" alignItems="center" height="10rem">
        <Text>No se encontraron resultados</Text>
      </Flex>
    );
  }

  return (
    <>
      <TableContainer overflowY="scroll" border="1px solid" borderRadius="0.5rem" borderColor="#f2f2f2">
        <Table variant="simple">
          <Thead position="sticky" top="0" bg="#f2f2f2" zIndex="1">
            <Tr>
              <Th textAlign="center">ID</Th>
              <Th textAlign="center">Imagen</Th>
              <Th textAlign="center">Nombre</Th>
              <Th textAlign="center">Precio</Th>
              <Th textAlign="center">Descuento</Th>
              <Th textAlign="center">Público</Th>
              <Th textAlign="center">Original</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {data?.products.map((product, index) => {
              const mainImageUrl = getProductMainImage(product);
              const mediaCount = getMediaCount(product);
              const productHasVideo = hasVideo(product);

              return (
                <Tr key={index} h="3rem">
                  <Td maxW="8rem" textAlign="center">
                    {product.id}
                  </Td>
                  <Td display="flex" justifyContent="center">
                    <Box position="relative">
                      <Image
                        onClick={() => handleImage(mainImageUrl)}
                        src={mainImageUrl}
                        alt={product?.brand.name}
                        cursor={'pointer'}
                        fit="contain"
                        w="3.75rem"
                        h="3.75rem"
                      />

                      {mediaCount > 1 && (
                        <Badge
                          position="absolute"
                          top="-0.25rem"
                          right="-0.25rem"
                          borderRadius="full"
                          px="0.375rem"
                          fontSize="0.625rem"
                          colorScheme="blue"
                        >
                          {mediaCount}
                        </Badge>
                      )}

                      {productHasVideo && (
                        <Badge
                          position="absolute"
                          bottom="-0.25rem"
                          left="-0.25rem"
                          borderRadius="full"
                          px="0.375rem"
                          fontSize="0.625rem"
                          colorScheme="purple"
                        >
                          📹
                        </Badge>
                      )}
                    </Box>
                  </Td>
                  <Td maxW="20rem" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
                    {product.name}
                  </Td>
                  <Td textAlign="center">{product.price}</Td>
                  <Td textAlign="center">{product.discount ?? 0} %</Td>
                  <Td textAlign="center">
                    <Checkbox isDisabled defaultChecked={product?.is_public} bg="#f2f2f2" />
                  </Td>
                  <Td textAlign="center">
                    <Checkbox isDisabled defaultChecked={product?.is_original} bg="#f2f2f2" />
                  </Td>
                  <Td textAlign="center">
                    <Flex gap="0.25rem" justifyContent="center">
                      <IconButton
                        aria-label="Ver detalle"
                        icon={<ViewIcon />}
                        variant="ghost"
                        size="sm"
                        _hover={{ bg: 'blue.50' }}
                        onClick={() => handleViewDetail(product)}
                      />
                      <IconButton
                        aria-label="Editar"
                        icon={<EditIcon />}
                        variant="ghost"
                        size="sm"
                        _hover={{ bg: 'blackAlpha.100' }}
                        onClick={() => handleEdit(product)}
                      />
                      <IconButton
                        aria-label="Eliminar"
                        icon={<DeleteIcon />}
                        variant="ghost"
                        size="sm"
                        colorScheme="red"
                        _hover={{ bg: 'red.50' }}
                        onClick={() => handleDeleteClick(product)}
                      />
                    </Flex>
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>

      <Flex justifyContent="space-between" alignItems="center" mt="1rem">
        <Text>Mostrando {data?.products?.length || 0} resultados</Text>

        <Flex gap="1rem" alignItems="center">
          <IconButton
            aria-label="Anterior"
            icon={<ChevronLeftIcon />}
            onClick={handlePreviousPage}
            isDisabled={pageIndex === 0}
          />
          <Text fontWeight="medium">{pageIndex + 1}</Text>
          <IconButton
            aria-label="Siguiente"
            icon={<ChevronRightIcon />}
            onClick={handleNextPage}
            isDisabled={!data?.products || data.products.length < pageSize}
          />
        </Flex>
      </Flex>

      <ImageModal disclosure={imageDisclosure} image={imageSrc} title={''} isMobile={false} />
      <ProductEditModal isOpen={isOpen} product={product} onOpen={onOpen} onClose={onClose} />

      {/* Detail Modal */}
      <Modal isOpen={detailDisclosure.isOpen} onClose={detailDisclosure.onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Detalle del Producto</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb="1.5rem">
            {detailProduct && (
              <Flex flexDir="column" gap="0.75rem" fontSize="0.875rem">
                <Flex gap="1rem">
                  <Text fontWeight="bold" minW="8rem">Código:</Text>
                  <Text>{detailProduct.id}</Text>
                </Flex>
                <Flex gap="1rem">
                  <Text fontWeight="bold" minW="8rem">Nombre:</Text>
                  <Text>{detailProduct.name}</Text>
                </Flex>
                <Flex gap="1rem">
                  <Text fontWeight="bold" minW="8rem">Descripción:</Text>
                  <Text>{detailProduct.description || '-'}</Text>
                </Flex>
                <Flex gap="1rem">
                  <Text fontWeight="bold" minW="8rem">Precio:</Text>
                  <Text>${detailProduct.price}</Text>
                </Flex>
                <Flex gap="1rem">
                  <Text fontWeight="bold" minW="8rem">Descuento:</Text>
                  <Text>{detailProduct.discount ?? 0}%</Text>
                </Flex>
                <Flex gap="1rem">
                  <Text fontWeight="bold" minW="8rem">Marca:</Text>
                  <Text>{detailProduct.brand?.name || detailProduct.brand?.id}</Text>
                </Flex>
                <Flex gap="1rem">
                  <Text fontWeight="bold" minW="8rem">Categoría:</Text>
                  <Text>{detailProduct.category?.name || detailProduct.category?.id}</Text>
                </Flex>
                <Flex gap="1rem">
                  <Text fontWeight="bold" minW="8rem">Público:</Text>
                  <Text>{detailProduct.is_public ? 'Sí' : 'No'}</Text>
                </Flex>
                <Flex gap="1rem">
                  <Text fontWeight="bold" minW="8rem">Original:</Text>
                  <Text>{detailProduct.is_original ? 'Sí' : 'No'}</Text>
                </Flex>
                <Flex gap="1rem">
                  <Text fontWeight="bold" minW="8rem">Creado:</Text>
                  <Text>{detailProduct.created_at ? String(detailProduct.created_at) : '-'}</Text>
                </Flex>
                {detailProduct.multimedias && detailProduct.multimedias.length > 0 && (
                  <Flex gap="1rem">
                    <Text fontWeight="bold" minW="8rem">Multimedia:</Text>
                    <Text>{detailProduct.multimedias.length} archivo(s)</Text>
                  </Flex>
                )}
                {detailProduct.specifications && detailProduct.specifications.length > 0 && (
                  <Box>
                    <Text fontWeight="bold" mb="0.25rem">Especificaciones:</Text>
                    {detailProduct.specifications.map((s: any, i: number) => (
                      <Text key={i} ml="1rem">{s.name}: {s.value}</Text>
                    ))}
                  </Box>
                )}
                {detailProduct.related_links && detailProduct.related_links.length > 0 && (
                  <Box>
                    <Text fontWeight="bold" mb="0.25rem">Links relacionados:</Text>
                    {detailProduct.related_links.map((l: any, i: number) => (
                      <Text key={i} ml="1rem">{l.name} - {l.url}</Text>
                    ))}
                  </Box>
                )}
              </Flex>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={deleteDisclosure.isOpen} onClose={deleteDisclosure.onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Desactivar producto</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            ¿Estás seguro que deseas desactivar el producto <strong>{deleteProduct?.name}</strong> ({deleteProduct?.id})? El producto dejará de ser visible al público pero se mantendrá en el sistema.
          </ModalBody>
          <ModalFooter>
            <Flex gap="0.75rem">
              <Button onClick={deleteDisclosure.onClose}>Cancelar</Button>
              <Button colorScheme="red" onClick={handleDeleteConfirm} isLoading={isDeleting}>
                Desactivar
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
