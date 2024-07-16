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
} from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';
import { useProductSearch } from 'shared';
import { Flex, Text, ImageModal, ProductEditModal } from 'ui';
import { useState } from 'react';
import { Product } from 'shared/entities/product';

type ProductTableProps = {
  categoryId?: string;
  brandId?: number;
  text?: string;
};

export const ProductTable = ({ categoryId, brandId, text }: ProductTableProps) => {
  const { isLoading, error, data } = useProductSearch({ categoryId, brandId, text });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const imageDisclosure = useDisclosure();
  const [product, setProduct] = useState<Product>();
  const [imageSrc, setImageSrc] = useState<string>();

  const handleEdit = (product: Product) => {
    setProduct(product);
    onOpen();
  };

  const handleImage = (src: string) => {
    setImageSrc(src);
    imageDisclosure.onOpen();
  };


  if (error) {
    console.log(error)
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
  } else {
    if (data?.products?.length === 0) {
      return (
        <Flex justifyContent="center" alignItems="center" height="10rem">
          <Text>No se encontraron resultados</Text>
        </Flex>
      );
    } else {
      return (
        <>
          <TableContainer maxH="73%" overflowY="scroll" border="1px solid" borderRadius="0.5rem" borderColor="#f2f2f2">
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
                {data?.products.map((product, index) => (
                  <Tr key={index} h="3rem">
                    <Td maxW="8rem" textAlign="center">
                      {product.id}
                    </Td>
                    <Td display="flex" justifyContent="center">
                      <Image
                        onClick={() => handleImage(product.image_url)}
                        src={product?.image_url}
                        alt={product?.brand.name}
                        cursor={'pointer'}
                        fit="contain"
                        w="3.75rem"
                        h="3.75rem"
                      />
                    </Td>
                    <Td maxW="20rem" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
                      {product.name}
                    </Td>
                    <Td textAlign="center">{product.price}</Td>
                    <Td textAlign="center">{product.discount} %</Td>
                    <Td textAlign="center">
                      <Checkbox isDisabled defaultChecked={product.is_public} bg="#f2f2f2" />
                    </Td>
                    <Td textAlign="center">
                      <Checkbox isDisabled defaultChecked={product.is_original} bg="#f2f2f2" />
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
                ))}
              </Tbody>
            </Table>
          </TableContainer>
          <Flex alignItems="center">
            <Text>Mostrando {data?.products.length} resultados</Text>
          </Flex>
          <ImageModal disclosure={imageDisclosure} image={imageSrc} title={''} isMobile={false} />
          <ProductEditModal isOpen={isOpen} product={product} onOpen={onOpen} onClose={onClose} />
        </>
      );
    }
  }
};
