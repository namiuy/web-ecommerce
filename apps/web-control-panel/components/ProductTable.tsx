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
  Image,
  Spinner,
  Checkbox,
  Badge,
} from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';
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
  const [product, setProduct] = useState<Product>();
  const [imageSrc, setImageSrc] = useState<string>();

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
                    <IconButton
                      aria-label="Editar"
                      icon={<EditIcon />}
                      variant="filled"
                      colorScheme="primary"
                      size="lg"
                      borderRadius="50%"
                      _hover={{ bg: 'blackAlpha.100' }}
                      onClick={() => handleEdit(product)}
                    />
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
    </>
  );
};
