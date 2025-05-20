import { Button, Flex, Heading, Text } from 'ui';
import { DeleteIcon, AddIcon } from '@chakra-ui/icons';
import { IconButton, Badge } from '@chakra-ui/react';
import { ProductList } from 'shared/entities/product-list';
import { useProductListList } from 'shared';

const productLists: ProductList[] = [
  {
    id: 15,
    section: 'home_a',
    indx: 0,
    name: 'Polleritas Destacadas',
    products: [],
    product_ids: ['ZA-ZB110', 'ZA-ZB110FULL', 'ZA-ZBLE110', 'ZA-ZB110AUT'],
  },
  {
    id: 18,
    section: 'home_a',
    indx: 3,
    name: '250-450 cc Destacadas',
    products: [],
    product_ids: ['ZA-CE250', 'CFM-250NK', 'KTM-DUKE250', 'KTM-ADVENTURE250'],
  },
  {
    id: 19,
    section: 'home_a',
    indx: 4,
    name: '600-1000 cc Destacadas',
    products: [],
    product_ids: ['CFM-650MTV', 'CFM-650MT', 'CFM-650NK', 'CFM-650TRG'],
  },
  {
    id: 20,
    section: 'home_a',
    indx: 5,
    name: 'Scooters Destacadas',
    products: [],
    product_ids: ['ZA-STYRT125', 'Y-RAYZ125', 'S-BURGMAN', 'Y-NMX'],
  },
  {
    id: 16,
    section: 'home_a',
    indx: 1,
    name: '110-125 cc Destacadas',
    products: [],
    product_ids: ['LIFAN-DYNAMIC125', 'BA-DIS', 'BA-PULNS125', 'ZA-RXZ7'],
  },
  {
    id: 17,
    section: 'home_a',
    indx: 2,
    name: '150-200 cc Destacadas',
    products: [],
    product_ids: ['LIFAN-DYNAMIC200', 'CFM-150NK', 'Y-FZN150', 'BA-NS200FI'],
  },
  {
    id: 50,
    section: 'home_a',
    indx: 2,
    name: '150-200 cc Destacadas',
    products: [],
    product_ids: ['LIFAN-DYNAMIC200', 'CFM-150NK', 'Y-FZN150', 'BA-NS200FI'],
  },
];

type ProductProps = {
  name: string;
};

const Product = ({ name }: ProductProps) => {
  return (
    <Flex
      role="group"
      position="relative"
      rounded="lg"
      p="0.75rem"
      pr="2.25rem"
      boxShadow="md"
      cursor="pointer"
      bg="#e0dede"
      h="7rem"
      minW="100%"
      gap="1rem"
    >
      <IconButton
        position="absolute"
        p="0"
        top={1}
        right={1}
        aria-label="delete-task"
        size="sm"
        color="gray.700"
        colorScheme="solid"
        icon={<DeleteIcon />}
      />
      <Flex justifyContent="center" alignItems="center" bg="#c7c5c5" w="5.5rem" h="5.5rem">
        <Text>Imagen</Text>
      </Flex>
      <Flex flexDir="column" justifyContent="center">
        <Text fontSize="0.875rem" color="blackAlpha.600">
          Categoria
        </Text>
        <Text fontSize="1.25rem">Titulo</Text>
        <Text fontSize="1.375rem">U$S 0</Text>
      </Flex>
    </Flex>
  );
};

const AddColumn = () => {
  return (
    <Flex flexDir="column" rounded="lg" w="22rem" h="32rem">
      <Heading fontSize="md" letterSpacing="wide" mb="0.5rem">
        <Badge px={2} py={1} rounded="lg" bg="#f2f2f2">
          NUEVA LISTA
        </Badge>
      </Heading>
      <Flex
        h="93%"
        rounded="lg"
        boxShadow="md"
        cursor="pointer"
        bg="#f2f2f2"
        justifyContent="center"
        alignItems="center"
        flexDir="column"
      >
        <IconButton
          aria-label="delete-task"
          size="md"
          color="gray.700"
          colorScheme="solid"
          icon={<AddIcon />}
          opacity="1"
        />
      </Flex>
    </Flex>
  );
};

const Column = (productList: ProductList) => {
  return (
    <Flex flexDir="column" rounded="lg" w="22rem" h="31.5rem">
      <Heading fontSize="lg" letterSpacing="wide" mb="0.5rem">
        <Badge px={2} py={1} rounded="lg" bg="#f2f2f2">
          {productList.name}
        </Badge>
      </Heading>
      <Flex flexDir="column" p="1rem" gap="1rem" bg="#f2f2f2" rounded="lg" boxShadow="md" overflowY="scroll">
        <Button
          size="sm"
          w="100%"
          color="gray.800"
          bg="#e0dede"
          py={2}
          variant="solid"
          colorScheme="black"
          aria-label="add-task"
          boxShadow="md"
          leftIcon={<AddIcon />}
        >
          Agregar producto
        </Button>
        {productList.product_ids.map((product_id, index) => (
          <Product key={index} name={product_id} />
        ))}
      </Flex>
    </Flex>
  );
};

export const ProductLists = () => {
  const { data = [], isLoading } = useProductListList();
  return (
    <Flex flexDir="column" px="0" minW="100%" minH="100%" overflowX="scroll">
      <Text fontSize="1.5rem" fontWeight="medium" mb="1rem">
        Listas de productos
      </Text>
      <Flex justifyContent="center" rowGap="3rem" columnGap="2rem" flexWrap="wrap" pb="2rem">
        {productLists.map(productList => (
          <Column key={productList.id} {...productList} />
        ))}
        <AddColumn />
      </Flex>
    </Flex>
  );
};
