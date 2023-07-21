import { Container, Image, Grid, GridItem, Text, Box, useDisclosure } from '@chakra-ui/react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
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

type RelatedLink = {
  name: string;
  url: string;
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
  relatedLinks: RelatedLink[];
};

const ShowImage = (props: any) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Image onClick={onOpen} src={props.image} alt="Herramienta NAMI" cursor={'pointer'} />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxW={'70%'} maxH={'85%'}>
          <ModalHeader>{props.brand}</ModalHeader>
          <ModalCloseButton />
          <ModalBody mx={'auto'}>
            <Image src={props.image} alt="Herramienta NAMI" />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={onClose}>
              CERRAR
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

const ProductDetail = () => {
  const product: Product = jsonStr;
  return (
    <Container maxW={'950px'} border={'1px'} borderColor={'blackAlpha.200'} p={'2rem'} mt={'5rem'}>
      <Grid
        templateAreas={`"image details" "description description"`}
        templateRows={'auto 1fr'}
        templateColumns={'repeat(2, 1fr)'}
        gap={4}
      >
        <GridItem area={'image'} borderRight={'1px'} borderColor={'blackAlpha.200'} pr={'3rem'}>
          <ShowImage brand={product.brand.name} image={product.image} />
        </GridItem>
        <GridItem area={'details'} pl={'2rem'}>
          <Box borderBottom={'1px'} borderColor={'blackAlpha.200'}>
            <Text fontWeight={'extrabold'} fontSize={'1.3rem'}>
              {product.name}
            </Text>
            <Text color={'blackAlpha.600'} fontSize={'0.8rem'}>
              <Text as="span" fontSize={'0.6rem'}>
                Cod{' '}
              </Text>
              {product.code}
            </Text>
            <Text pt={'1rem'} pb={'2.5rem'} fontSize={'2.2rem'}>
              <Text as="span" fontSize={'1.7rem'}>
                U$S{' '}
              </Text>
              {product.price}
              <Text as="span" color={'blackAlpha.600'} fontSize={'0.6rem'}>
                {' '}
                + IVA
              </Text>
            </Text>
          </Box>
          <Box>
            <Text color={'blackAlpha.600'} fontSize={'0.65rem'} pt={'2rem'} pb={'1rem'}>
              Stock {product.stock === 'SI' ? 'Si' : 'No'}
            </Text>
            <Button width={'100%'} bg={'red.500'} color={'white'} _hover={{ bg: 'red.700' }}>
              COMPRAR
            </Button>
          </Box>
        </GridItem>
        <GridItem area={'description'} borderTop={'1px'} borderColor={'blackAlpha.200'}>
          <Text pt={'1.5rem'}> {product.description} </Text>
        </GridItem>
      </Grid>
    </Container>
  );
};

export default ProductDetail;
