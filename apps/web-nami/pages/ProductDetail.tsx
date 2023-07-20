import { Container } from '@chakra-ui/react';
import { Image } from '@chakra-ui/react';
import { Grid } from '@chakra-ui/react';
import { GridItem } from '@chakra-ui/react';
import { Text } from '@chakra-ui/react';
import { Button } from 'ui';

const jsonStr = {
  code: 'STLT235SB',
  name: 'ELEVADOR 2 COLUMNAS 3.5 TONS TRABAS MANUALES OFERTA !!! LAUNCH',
  description: 'HIDRAULICO',
  price: 2900,
  stock: 'NO',
  image: 'https://www.nami.com.uy/FotosNami/STLT235SB.jpg',
  brand: {
    name: 'Launch',
  },
  category: {
    name: '2 columnas',
  },
  relatedLinks: [
    {
      name: 'Información técnica',
      url: 'https://drive.google.com/drive/folders/1EvzVhKjFrV_QXBT7yy3ZbcxWpVrHXuRP?lfhs=2',
    },
  ],
};

type Product = {
  code: string;
  name: string;
  description: string;
  price: number;
  stock: string;
  image: string;
  brand: {
    name: string;
  };
  category: {
    name: string;
  };
  relatedLinks: [
    {
      name: string;
      url: string;
    },
  ];
};

const ProductDetail = () => {
  const product: Product = jsonStr;
  return (
    <Container maxW={'950px'} h={'550px'} border={'1px'} p={'5'} mt={'4'}>
      <Grid
        templateAreas={`"image details" "image buy" "description description"`}
        templateRows={'repeat(3, 1fr)'}
        templateColumns={'repeat(2, 1fr)'}
        gap={4}
      >
        <GridItem bg={'purple.100'} area={'image'} borderRight={'1px'} p={'1rem'}>
          <Image src={product.image} alt="Herramienta NAMI" />
        </GridItem>
        <GridItem bg="purple.100" area={'details'}>
          <Text>{product.name}</Text>
          <Text>{product.code}</Text>
          <Text>{product.price} + IVA </Text>
        </GridItem>
        <GridItem bg="purple.100" area={'buy'}>
          <Text>{product.stock}</Text>
          <Button>Comprar</Button>
        </GridItem>
        <GridItem bg="purple.100" borderTop={'1px'} area={'description'}>
          <Text> {product.description} </Text>
        </GridItem>
      </Grid>
    </Container>
  );
};

export default ProductDetail;
