import { Icon, Tooltip, Link } from '@chakra-ui/react';
import { Brand } from 'shared/entities/brand';
import { Category } from 'shared/entities/category';
import { Product } from 'shared/entities/product';
import { Container, Grid, GridItem, Heading, Text, Box, Button } from 'ui';
import { CheckIcon, CloseIcon, PhoneIcon } from '@chakra-ui/icons';
import { BiSolidShoppingBag } from 'react-icons/bi';
import { ImageModal } from 'ui/components/ImageModal';

const jsonStr = {
  id: 'STLT235SB',
  name: 'ELEVADOR 2 COLUMNAS 3.5 TONS TRABAS MANUALES OFERTA !!! LAUNCH',
  description: 'HIDRAULICO',
  price: 2900,
  stock: 'AV',
  image_url: 'https://www.nami.com.uy/FotosNami/STLT235SB.jpg',
  brand: {
    name: 'Launch',
  } as Brand,
  category: {
    name: '2 columnas',
  } as Category,
  relatedLinks: [
    {
      name: 'Información técnica',
      url: 'https://drive.google.com/drive/folders/1EvzVhKjFrV_QXBT7yy3ZbcxWpVrHXuRP?lfhs=2',
    },
  ],
} as Product;

const ProductDetail = () => {
  const product: Product = jsonStr;
  return (
    <>
      <Container
        maxW={{ lg: '65%', base: '90%' }}
        p={{ lg: '2rem', base: '1rem' }}
        mt={'5rem'}
        boxShadow={' 0 3px 5px -1px rgb(0 0 0 / 5%), 0 6px 40px 0 rgb(0 0 0 / 3%), 0 1px 18px 0 rgb(0 0 0 / 2%);'}
      >
        <Grid
          templateAreas={{ lg: `"image details" "description description"`, base: `"image" "details" "description"` }}
          templateRows={'auto 1fr'}
          templateColumns={{ lg: 'repeat(2, 1fr)', base: 'repeat(1, 1fr)' }}
          gap={4}
        >
          <GridItem
            area={'image'}
            pr={{ lg: '3rem', base: '0' }}
            borderRight={{ lg: '1px', base: '0' }}
            borderColor={{ lg: 'blackAlpha.200' }}
          >
            <ImageModal image={product.image_url} brand={product.brand.name} />
          </GridItem>
          <GridItem area={'details'} pl={{ lg: '2rem', base: '0' }}>
            <Box borderBottom={'1px'} borderColor={'blackAlpha.200'}>
              <Text fontWeight={'extrabold'} fontSize={'1.3rem'}>
                {product.name}
              </Text>
              <Text color={'blackAlpha.600'} fontSize={'0.8rem'}>
                <Text as="span" fontSize={'0.6rem'}>
                  Cod{' '}
                </Text>
                {product.id}
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
              <Text color={'blackAlpha.600'} fontSize={'0.75rem'} pt={'2rem'} pb={'1rem'}>
                Stock
                {product.stock === 'AV' && (
                  <Tooltip label="Disponible" bg={'blackAlpha.700'} fontSize={'0.7rem'} borderRadius={'5px'}>
                    <CheckIcon ml={'5px'} boxSize={3} mb={'3px'} />
                  </Tooltip>
                )}
                {product.stock === 'CO' && (
                  <Tooltip label="Consulte" bg={'blackAlpha.700'} fontSize={'0.7rem'} borderRadius={'5px'}>
                    <PhoneIcon ml={'5px'} boxSize={3} mb={'3px'} />
                  </Tooltip>
                )}
                {product.stock === 'NO' && (
                  <Tooltip label="Agotado" bg={'blackAlpha.700'} fontSize={'0.7rem'} borderRadius={'5px'}>
                    <CloseIcon ml={'5px'} boxSize={3} mb={'3px'} />
                  </Tooltip>
                )}
              </Text>
              <Button
                width={'100%'}
                bg={'red.500'}
                color={'white'}
                _hover={{ bg: 'red.700' }}
                isDisabled={product.stock === 'CO' || product.stock === 'NO'}
              >
                COMPRAR <Icon as={BiSolidShoppingBag} ml={'5px'} mb={'3px'} boxSize={4} />
              </Button>
            </Box>
          </GridItem>
          <GridItem area={'description'} borderTop={'1px'} borderColor={'blackAlpha.200'}>
            <Text pt={'1.5rem'}> {product.description} </Text>
          </GridItem>
        </Grid>
      </Container>
      <Box my={'4rem'} borderY={'1px'} borderColor={'blackAlpha.200'} py={'3rem'}>
        <Container maxW={{ lg: '65%', base: '90%' }} px={0} mb={'2rem'}>
          <Heading fontSize={'1.5rem'} color={'blackAlpha.700'}>
            LINKS
          </Heading>
        </Container>
        <Container
          maxW={{ lg: '65%', base: '90%' }}
          px={0}
          _hover={{ bg: 'blue.50' }}
          boxShadow={'0 3px 5px -1px rgb(0 0 0 / 5%), 0 6px 40px 0 rgb(0 0 0 / 3%), 0 1px 18px 0 rgb(0 0 0 / 2%)'}
        >
          <Link href={product.relatedLinks[0].url} display={'block'} p={'1rem'} color={'blue.400'}>
            <Box>{product.relatedLinks[0].name}</Box>
          </Link>
        </Container>
      </Box>
    </>
  );
};

export default ProductDetail;
