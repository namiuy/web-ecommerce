import { Container } from '@chakra-ui/react';
import { Image } from '@chakra-ui/react';
import { Grid } from '@chakra-ui/react';
import { GridItem } from '@chakra-ui/react';
import { Text } from '@chakra-ui/react';

const jsonStr = {
  code: 'STLT235SB',
  name: 'ELEVADOR 2 COLUMNAS 3.5 TONS TRABAS MANUALES OFERTA !!! LAUNCH',
  description: 'HIDRAULICO',
  price: 2900,
  stock: 'NO',
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

type Producto = {
  code: string;
  name: string;
  description: string;
  price: number;
  stock: string;
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
  const producto: Producto = jsonStr;
  return (
    <Container maxW={'950px'} h={'550px'} border={'1px'} p={'5'} mt={'4'}>
      <Grid
        templateAreas={`"image details" "image buy" "description description"`}
        templateRows={'repeat(3, 1fr)'}
        templateColumns={'repeat(2, 1fr)'}
        gap={4}
      >
        <GridItem bg={'purple.100'} area={'image'} borderRight={'1px'} p={'1rem'}>
          <Image src="https://www.nami.com.uy/FotosNami/STLT235SB.jpg" alt="Herramienta NAMI" />
        </GridItem>
        <GridItem bg="purple.100" area={'details'}>
          <Text>{producto.name}</Text>
          <Text>{producto.code}</Text>
          <Text>{producto.price}</Text>
        </GridItem>
        <GridItem bg="purple.100" area={'buy'}></GridItem>
        <GridItem bg="purple.100" borderTop={'1px'} area={'description'}>
          <Text> {producto.description} </Text>
        </GridItem>
      </Grid>
    </Container>
  );
};

export default ProductDetail;
