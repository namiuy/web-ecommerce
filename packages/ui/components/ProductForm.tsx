import {
  Button,
  Center,
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
  AspectRatio,
} from '@chakra-ui/react';
import { useMemo, useState } from 'react';
import {
  getObjectDifference,
  productAdd,
  productDelete,
  productUpdate,
  useBrandList,
  useCategoryList,
  validateEmpty,
} from 'shared';
import { Brand } from 'shared/entities/brand';
import { Category } from 'shared/entities/category';
import { Product } from 'shared/entities/product';
import { Box } from '..';
import { Form, FormSchema } from './Form';
import { FileUpload } from './FileUpload';
import { v4 as uuidv4 } from 'uuid';

const _grey0 = 'brand.grey.0';

const schema: FormSchema[] = [
  { id: 'category', type: 'select', label: 'Categoria', defaultValue: '1' },
  { id: 'brand', type: 'select', label: 'Marca', defaultValue: 1 },
  { id: 'id', type: 'input', label: 'Código', validate: validateEmpty, defaultValue: '' },
  { id: 'name', type: 'input', label: 'Nombre', validate: validateEmpty, defaultValue: '' },
  { id: 'description', type: 'textarea', label: 'Descripción', defaultValue: '' },
  { id: 'price', type: 'number', label: 'Precio', validate: validateEmpty, defaultValue: 0 },
  { id: 'discount', type: 'number', label: 'Descuento', defaultValue: 0 },
  { id: 'is_original', type: 'checkbox', label: 'Original', defaultValue: false },
  { id: 'is_public', type: 'checkbox', label: 'Publico', defaultValue: false },
];

type ModalDeleteProps = {
  isOpen: boolean;
  name?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

type ProductFormProps = {
  product?: Product;
  onSuccess: () => void;
};

const mapCategoryOptions = (data: Category[]) => {
  return data.flatMap(c => (c?.sub_categories ? [c, ...c.sub_categories] : [c])).map(({ id, name }) => ({ id, name }));
};

const mapBrandOptions = (data: Brand[]) => {
  return data.map(({ id, name }) => ({ id, name })).map(({ id, name }) => ({ id, name }));
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

  const handleError = (error: Error) => {
    console.log(error);
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
    const diff = getObjectDifference(data, { ...values, image_url: imageUrl });
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

  return (
    <Grid alignItems="start" mt="1rem" gridTemplateColumns={{ base: '1fr', md: '1fr 1fr' }}>
      <Center p={{ base: '2rem 1rem', lg: '2rem' }}>
        <AspectRatio w="100%" ratio={4 / 3}>
          <>
            <Image alt={data?.name} src={imageUrl} fit="contain" fallback={<Box w="100%" bg={_grey0} />} />
            <FileUpload
              pos="absolute"
              path="products"
              fileName={product?.id ?? uuidv4()}
              bg={imageUrl ? 'transparent' : _grey0}
              border="none"
              _hover={{ bg: 'rgba(0,0,0,0.2)' }}
              onSuccess={result => setImageUrl(result?.url)}
            >
              {imageUrl ? 'Remplazar imagen' : 'Subir imagen'}
            </FileUpload>
          </>
        </AspectRatio>
      </Center>
      <Form
        isLoading={isLoading}
        schema={schema}
        data={data}
        selectors={{
          category: selectCategoryOptions,
          brand: selectBrandOptions,
        }}
        onSubmit={isAdd ? add : update}
        onDelete={isAdd ? undefined : modalOpen}
      />
      <ModalDelete isOpen={isModalDelOpen} name={data?.name} onConfirm={del} onCancel={modalDelClose} />
    </Grid>
  );
};
