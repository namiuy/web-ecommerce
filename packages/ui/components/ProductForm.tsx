import {
  Button,
  Flex,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Grid,
  useDisclosure,
  useToast,
  Textarea,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Progress,
  Select,
  Input,
  Checkbox,
} from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import {
  getObjectDifference,
  mapBrandOptions,
  mapCategoryOptions,
  productAdd,
  productDelete,
  productUpdate,
  useBrandList,
  useCategoryList,
  validateEmpty,
} from 'shared';
import { Product } from 'shared/entities/product';
import { Box } from '..';
import { FileUpload } from './FileUpload';
import { v4 as uuidv4 } from 'uuid';
import { Formik, Field } from 'formik';
import { ColorSelector } from './ColorSelector';
import { FaTrashAlt } from 'react-icons/fa';
import { EditIcon } from '@chakra-ui/icons';
import { FaPlus } from 'react-icons/fa';

const _grey0 = 'brand.grey.0';

import { product as productConf } from 'shared';
const { showColors } = productConf;

const hiddenInputs = {
  colors: !showColors,
};

type ModalDeleteProps = {
  isOpen: boolean;
  name?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

const ModalDelete = ({ isOpen, name = '', onConfirm, onCancel }: ModalDeleteProps) => (
  <Modal isOpen={isOpen} onClose={onCancel}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Eliminar un producto</ModalHeader>
      <ModalCloseButton />
      <ModalBody>¿Esta seguro que desea eliminar el producto {name}?</ModalBody>
      <ModalFooter>
        <Flex gap="1rem">
          <Button onClick={onCancel}>Cancelar</Button>
          <Button colorScheme="red" onClick={onConfirm}>
            Eliminar
          </Button>
        </Flex>
      </ModalFooter>
    </ModalContent>
  </Modal>
);

type ProductFormProps = {
  product?: Product;
  onSuccess: () => void;
};

export const ProductForm = ({ product, onSuccess }: ProductFormProps) => {
  const isAdd = !product;
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(product?.image_url);
  const { isOpen: isModalDelOpen, onOpen: modalOpen, onClose: modalDelClose } = useDisclosure();
  const toast = useToast();

  const { data: categories = [] } = useCategoryList();
  const { data: brands = [] } = useBrandList();

  const brandId = product?.brand.id;
  const categoryId = product?.category.id;
  const data = isAdd ? undefined : { ...product, brand: brandId, category: categoryId };
  const selectCategoryOptions = useMemo(() => mapCategoryOptions(categories), [categories]);
  const selectBrandOptions = useMemo(() => mapBrandOptions(brands), [brands]);

  const selectCategoryOptionsWithParent = selectCategoryOptions.map(option => ({
    ...option,
    name: option?.parent ? `${option.parent} | ${option.name}` : option.name,
  }));

  const handleSubmit = (values: Record<string, any>) => {
    isAdd ? add(values) : update(values);
  };

  const handleError = (error: Error) => {
    console.log('Error de prueba', error);
  };

  const showToast = (message: string) => {
    toast({
      title: message,
      status: 'success',
      isClosable: true,
    });
  };

  const add = (values: Record<string, any>) => {
    setIsLoading(true);
    productAdd({
      ...values,
      image_url: imageUrl ?? '',
      brand: { id: Number(values.brand) },
      category: { id: values.category.toString() },
      colors: productColors,
      images: images,
    } as Product)
      .then(() => {
        showToast('Producto agregado correctamente');
        onSuccess();
      })
      .catch(handleError)
      .finally(() => setIsLoading(false));
  };

  const update = (values: Record<string, any>) => {
    setIsLoading(true);
    const diff = getObjectDifference(data, { ...values, image_url: imageUrl, colors: productColors, images: images });
    if (Object.keys(diff).length) {
      diff.id = data?.id;
      if (diff.brand) diff.brand = { id: Number(values.brand) };
      if (diff.category) diff.category = { id: values.category.toString() };
      productUpdate(values.id, diff)
        .then(() => {
          showToast('Producto modificado correctamente');
          onSuccess();
        })
        .catch(handleError)
        .finally(() => setIsLoading(false));
    } else {
      onSuccess();
    }
  };

  const del = () => {
    setIsLoading(true);
    modalDelClose();
    productDelete(data?.id || '')
      .then(() => {
        showToast('Producto eliminado correctamente');
        onSuccess();
      })
      .catch(handleError)
      .finally(() => setIsLoading(false));
  };

  const [productColors, setProductColors] = useState(product?.colors);

  const handleToggleColor = (colorId: string) => {
    setProductColors((prev = []) => (prev.includes(colorId) ? prev.filter(c => c !== colorId) : [...prev, colorId]));
  };

  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [mainImage, setMainImage] = useState<string>(product?.images?.[0] ?? '');

  return (
    <Grid alignItems="start" p="2rem" gridTemplateColumns={{ base: '1fr', md: '1fr 1fr' }} gap="2rem">
      <Flex p={{ base: '2rem 1rem', lg: '1rem' }} justifyContent="center" flexDir="column" gap="1rem">
        <Box
          w="100%"
          h="300px"
          borderRadius="md"
          bg="white"
          overflow="hidden"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {images.length === 0 ? (
            <FileUpload
              path="products"
              fileName={uuidv4()}
              bg={_grey0}
              border="1px dashed gray"
              borderRadius="md"
              boxSize="18rem"
              onSuccess={result => {
                const url = result?.url;
                if (typeof url === 'string') {
                  setImages([url]);
                  setMainImage(url);
                }
              }}
            />
          ) : (
            <Image alt={data?.name} src={mainImage} objectFit="contain" maxH="100%" maxW="100%" />
          )}
        </Box>
        {images.length > 0 && (
          <Flex gap="1.25rem" wrap="wrap" mt="1rem">
            {images.map((url, index) => (
              <Box
                key={index}
                role="group"
                pos="relative"
                boxSize="60px"
                border={url === mainImage ? '2px solid' : '1px solid'}
                borderColor={url === mainImage ? 'blue.400' : 'gray.300'}
                borderRadius="md"
                _hover={{ cursor: 'pointer' }}
                p="0.25rem"
                onClick={() => setMainImage(url)}
              >
                <Image src={url} alt={`Imagen ${index}`} boxSize="100%" objectFit="contain" />
                <Button
                  size="xs"
                  colorScheme="red"
                  pos="absolute"
                  top="-0.75rem"
                  right="-0.75rem"
                  borderRadius="50%"
                  zIndex={2}
                  display="none"
                  _groupHover={{ display: 'flex' }}
                  onClick={e => {
                    e.stopPropagation();
                    const updated = images.filter((_, i) => i !== index);
                    setImages(updated);
                    if (url === mainImage) setMainImage(updated[0] || '');
                  }}
                >
                  <FaTrashAlt size="0.625rem" />
                </Button>
              </Box>
            ))}
            <FileUpload
              path="products"
              fileName={uuidv4()}
              bg={_grey0}
              border="1px dashed gray"
              borderRadius="md"
              boxSize="60px"
              onSuccess={result => {
                const url = result?.url;
                if (typeof url === 'string') {
                  setImages(prev => [...prev, url]);
                  if (!mainImage) setMainImage(url);
                }
              }}
            >
              {''}
            </FileUpload>
          </Flex>
        )}
      </Flex>
      <Formik
        initialValues={{
          id: product?.id || '',
          category: product?.category.id.toString() || '',
          brand: product?.brand.id.toString() || '',
          name: product?.name || '',
          description: product?.description || '',
          price: product?.price || '',
          discount: product?.discount || 0,
          is_original: product?.is_original || false,
          is_public: product?.is_public || false,
        }}
        validateOnBlur={false}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, handleSubmit: hsf }) => (
          <form onSubmit={hsf}>
            <Flex direction="column" gap="1rem">
              <FormControl isInvalid={!!errors.id}>
                <FormLabel htmlFor="id" fontSize="0.875rem">
                  Codigo
                </FormLabel>
                <Field
                  as={Input}
                  disabled={!isAdd || isLoading}
                  bg="#f2f2f2"
                  id="id"
                  name="id"
                  type="text"
                  variant="filled"
                  _focus={{ borderColor: 'primary.main' }}
                  validate={(value: any) => {
                    return validateEmpty(value);
                  }}
                />
                <FormErrorMessage>{errors.brand}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.category}>
                <FormLabel htmlFor="category" fontSize="0.875rem">
                  Categoría
                </FormLabel>
                <Field
                  as={Select}
                  disabled={isLoading}
                  bg="#f2f2f2"
                  id="category"
                  name="category"
                  type="text"
                  variant="filled"
                  _focus={{ borderColor: 'primary.main' }}
                  validate={(value: any) => {
                    return validateEmpty(value);
                  }}
                >
                  {isAdd && <option value="-1">Selecciona una categoría...</option>}
                  {selectCategoryOptionsWithParent.map(({ id, name }, i) => (
                    <option key={i} value={id}>
                      {name}
                    </option>
                  ))}
                </Field>
                <FormErrorMessage>{errors.category}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.brand}>
                <FormLabel htmlFor="brand" fontSize="0.875rem">
                  Marca
                </FormLabel>
                <Field
                  as={Select}
                  disabled={isLoading}
                  bg="#f2f2f2"
                  id="brand"
                  name="brand"
                  type="text"
                  variant="filled"
                  _focus={{ borderColor: 'primary.main' }}
                  validate={(value: any) => {
                    return validateEmpty(value);
                  }}
                >
                  {isAdd && <option value="-1">Selecciona una marca...</option>}
                  {selectBrandOptions.map(({ id, name }, i) => (
                    <option key={i} value={id}>
                      {name}
                    </option>
                  ))}
                </Field>
                <FormErrorMessage>{errors.brand}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.name}>
                <FormLabel htmlFor="name" fontSize="0.875rem">
                  Nombre
                </FormLabel>
                <Field
                  as={Input}
                  disabled={isLoading}
                  bg="#f2f2f2"
                  id="name"
                  name="name"
                  type="text"
                  variant="filled"
                  _focus={{ borderColor: 'primary.main' }}
                  validate={(value: any) => {
                    return validateEmpty(value);
                  }}
                />
                <FormErrorMessage>{errors.name}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.description}>
                <FormLabel htmlFor="description" fontSize="0.875rem">
                  Descripción
                </FormLabel>
                <Field
                  as={Textarea}
                  disabled={isLoading}
                  bg="#f2f2f2"
                  id="description"
                  name="description"
                  type="text"
                  variant="filled"
                  _focus={{ borderColor: 'primary.main' }}
                  validate={(value: any) => {
                    return validateEmpty(value);
                  }}
                />
                <FormErrorMessage>{errors.description}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.price}>
                <FormLabel htmlFor="price" fontSize="0.875rem">
                  Precio
                </FormLabel>
                <Field
                  as={Input}
                  disabled={isLoading}
                  bg="#f2f2f2"
                  id="price"
                  name="price"
                  type="text"
                  variant="filled"
                  _focus={{ borderColor: 'primary.main' }}
                  validate={(value: any) => {
                    return validateEmpty(value);
                  }}
                />
                <FormErrorMessage>{errors.price}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.discount}>
                <FormLabel htmlFor="discount" fontSize="0.875rem">
                  Descuento
                </FormLabel>
                <Field
                  as={Input}
                  disabled={isLoading}
                  bg="#f2f2f2"
                  id="discount"
                  name="discount"
                  type="text"
                  variant="filled"
                  _focus={{ borderColor: 'primary.main' }}
                  validate={(value: any) => {
                    return validateEmpty(value);
                  }}
                />
                <FormErrorMessage>{errors.discount}</FormErrorMessage>
              </FormControl>

              <Flex justifyContent="flex-start" gap="2rem" mt="0.5rem">
                <FormControl isInvalid={!!errors.is_original} display="flex" alignItems="center" w="fit-content">
                  <FormLabel htmlFor="is_original" mb="0" fontSize="0.875rem">
                    Original
                  </FormLabel>
                  <Field
                    as={Checkbox}
                    disabled={isLoading}
                    defaultChecked={product?.is_original}
                    bg="#f2f2f2"
                    id="is_original"
                    name="is_original"
                    type="checkbox"
                    variant="filled"
                    _focus={{ borderColor: 'primary.main' }}
                  />
                  <FormErrorMessage>{errors.is_original}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.is_public} display="flex" alignItems="center" w="fit-content">
                  <FormLabel htmlFor="is_public" mb="0" fontSize="0.875rem">
                    Público
                  </FormLabel>
                  <Field
                    as={Checkbox}
                    disabled={isLoading}
                    defaultChecked={product?.is_public}
                    bg="#f2f2f2"
                    id="is_public"
                    name="is_public"
                    type="checkbox"
                    variant="filled"
                    _focus={{ borderColor: 'primary.main' }}
                  />
                  <FormErrorMessage>{errors.is_public}</FormErrorMessage>
                </FormControl>
              </Flex>

              {!hiddenInputs['colors'] && (
                <ColorSelector colors={productColors ?? []} onToggleColor={handleToggleColor} isEdit />
              )}

              <Progress
                h={isLoading ? '4px' : '1px'}
                m="1rem 0"
                size="xs"
                isIndeterminate={isLoading}
                colorScheme="black"
              />

              <Flex gap="1rem">
                <Button
                  disabled={isLoading}
                  type="submit"
                  bg="#f2f2f2"
                  width="full"
                  size="lg"
                  _hover={{ opacity: 0.8 }}
                  leftIcon={isAdd ? <FaPlus /> : <EditIcon />}
                  gap="0.25rem"
                >
                  {isAdd ? 'Agregar' : 'Modificar'}
                </Button>
                <Button
                  disabled={isLoading}
                  colorScheme="red"
                  width="4rem"
                  size="lg"
                  _hover={{ opacity: 0.8 }}
                  onClick={modalOpen}
                >
                  <FaTrashAlt />
                </Button>
              </Flex>
            </Flex>
          </form>
        )}
      </Formik>
      <ModalDelete isOpen={isModalDelOpen} name={data?.name} onConfirm={del} onCancel={modalDelClose} />
    </Grid>
  );
};
