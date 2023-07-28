import { Icon, Tooltip, Link } from '@chakra-ui/react';
import { Head, Container, Grid, GridItem, Heading, Text, Box, Button, Skeleton } from 'ui';
import { CheckIcon, CloseIcon, PhoneIcon } from '@chakra-ui/icons';
import { BiSolidShoppingBag } from 'react-icons/bi';
import { ImageModal } from 'ui/components/ImageModal';
import { useProductGet } from 'shared';
import { NextPage } from 'next';
import { NavBar } from '../components';
import { useRouter } from 'next/router';

const _backgroundColor = 'brand.productDetail.backgroundColor';
const _borderColor = 'brand.productDetail.borderColor';
const _returnLinkHoverColor = { color: 'brand.productDetail.linkColor' };

const _boxShadow = ' 0 3px 5px -1px rgb(0 0 0 / 5%), 0 6px 40px 0 rgb(0 0 0 / 3%), 0 1px 18px 0 rgb(0 0 0 / 2%) ';

const _containerSize = { lg: '65%', base: '90%' };
const _containerPadding = { lg: '2rem', base: '1rem' };

const _gridTemplateAreas = { lg: `"image details" "description description"`, base: `"image" "details" "description"` };
const _gridTemplateRows = { lg: 'auto 1fr', base: 'auto 1fr' };
const _gridTemplateColumns = { lg: 'repeat(2, 1fr)', base: 'repeat(1, 1fr)' };

const _gridItemImagePaddingRight = { lg: '2rem', base: '0' };
const _gridItemImageBorderRight = { lg: '1px', base: '0' };
const _griditemImageBorderColor = { lg: _borderColor, base: 'transparent' };

const _gridIemDetailsPaddingLeft = { lg: '2rem', base: '0' };

const _gridItemDetailsBuyButtonColors = { bg: 'red.500', color: 'white', _hover: { bg: 'red.700' } };

const _smallTextColor = 'brand.productDetail.smallText';

const _tooltipBg = 'brand.productDetail.tooltipBg';

const _stockIcon = { ml: '5px', boxSize: 3, mb: '3px' };
const _shoppingBagIcon = { ml: '5px', boxSize: 4, mb: '3px' };

const _relatedLinksMainContainerHover = { bg: 'blue.50' };
const _relatedLinksLinkColor = 'brand.productDetail.linkColor';

const _imageSkeletonMarginBottom = { lg: '0', base: '1rem' };

type ProductDetailProps = {
  id?: string;
};

const ProductDetail: NextPage<ProductDetailProps> = props => {
  const { isLoading, error, data } = useProductGet(props?.id || '');
  const router = useRouter();

  if (error) {
    console.log(error);
    return <></>;
  }

  return (
    <Box minHeight={'100vh'} bg={_backgroundColor}>
      <Head />
      <NavBar />
      <Container maxW={_containerSize} px={0} pt={'10rem'} mb={'0.25rem'} fontSize={'0.875rem'}>
        {isLoading || !data ? (
          <Skeleton w={'30%'} h={'1.25rem'} />
        ) : (
          <Box>
            <Link onClick={() => router.back()} style={{ textDecoration: 'none' }} _hover={_returnLinkHoverColor}>
              Volver
            </Link>
            <Text as="span" mx={'0.375rem'}>
              {' '}
              |{' '}
            </Text>

            <Link href={`/productos?c=${data.category.id}`} style={{ textDecoration: 'none' }} _hover={_returnLinkHoverColor}>
              {' '}
              {data.category.name}
            </Link>
          </Box>
        )}
      </Container>
      <Container maxW={_containerSize} p={_containerPadding} boxShadow={_boxShadow} bg={'white'}>
        <Grid templateAreas={_gridTemplateAreas} templateRows={_gridTemplateRows} templateColumns={_gridTemplateColumns}>
          <GridItem area={'image'} pr={_gridItemImagePaddingRight} borderRight={_gridItemImageBorderRight} borderColor={_griditemImageBorderColor}>
            {isLoading || !data ? (
              <Skeleton w={'100%'} h={'20rem'} mb={_imageSkeletonMarginBottom} />
            ) : (
              <ImageModal image={data.image_url} title={data.brand.name} />
            )}
          </GridItem>
          <GridItem area={'details'} pl={_gridIemDetailsPaddingLeft}>
            <Box borderBottom={'1px'} borderColor={_borderColor}>
              {isLoading || !data ? (
                <Skeleton w={'100%'} h={'3.5rem'} mb={'0.375rem'} />
              ) : (
                <Text fontWeight={'extrabold'} fontSize={'1.25rem'}>
                  {data.name}
                </Text>
              )}
              {isLoading || !data ? (
                <Skeleton w={'20%'} h={'1.25rem'} mb={'1.5rem'} />
              ) : (
                <Text color={_smallTextColor} fontSize={'0.75rem'}>
                  <Text as="span" fontSize={'0.625rem'}>
                    Cod{' '}
                  </Text>
                  {data.id}
                </Text>
              )}
              {isLoading || !data ? (
                <Skeleton w={'50%'} h={'2.5rem'} mb={'3rem'} />
              ) : (
                <Text pt={'1rem'} pb={'2.5rem'} fontSize={'2.25rem'}>
                  <Text as="span" fontSize={'1.625rem'}>
                    U$S{' '}
                  </Text>
                  {data.price}
                  <Text as="span" color={_smallTextColor} fontSize={'0.75rem'}>
                    {' '}
                    + IVA
                  </Text>
                </Text>
              )}
            </Box>
            <Box>
              {isLoading || !data ? (
                <Skeleton w={'7%'} h={'1rem'} my={'1rem'} />
              ) : (
                <Text color={_smallTextColor} fontSize={'0.75rem'} py={'1rem'}>
                  Stock
                  {data.stock === 'AV' && (
                    <Tooltip label="Disponible" bg={_tooltipBg} fontSize={'0.75rem'} borderRadius={'0.25rem'}>
                      <CheckIcon sx={_stockIcon} />
                    </Tooltip>
                  )}
                  {data.stock === 'CO' && (
                    <Tooltip label="Consulte" bg={_tooltipBg} fontSize={'0.75rem'} borderRadius={'0.25rem'}>
                      <PhoneIcon sx={_stockIcon} />
                    </Tooltip>
                  )}
                  {data.stock === 'NO' && (
                    <Tooltip label="Agotado" bg={_tooltipBg} fontSize={'0.75rem'} borderRadius={'0.25rem'}>
                      <CloseIcon sx={_stockIcon} />
                    </Tooltip>
                  )}
                </Text>
              )}
              {isLoading || !data ? (
                <Skeleton w={'100%'} h={'2.5rem'} />
              ) : (
                <Button width={'100%'} sx={_gridItemDetailsBuyButtonColors} isDisabled={data.stock === 'CO' || data.stock === 'NO'}>
                  COMPRAR <Icon as={BiSolidShoppingBag} sx={_shoppingBagIcon} />
                </Button>
              )}
            </Box>
          </GridItem>
          {data && data.description && (
            <GridItem area={'description'} borderTop={'1px'} borderColor={_borderColor} pt={'1.5rem'} mt={'2rem'}>
              {isLoading || !data ? <Skeleton w={'100%'} h={'3rem'} /> : <Text> {data.description} </Text>}
            </GridItem>
          )}
        </Grid>
      </Container>
      {data && data.relatedLinks && (
        <Box my={'4rem'} py={'3rem'} borderY={'1px'} borderColor={_borderColor}>
          <Container maxW={_containerSize} px={0} mb={'2rem'}>
            <Heading size={'lg'}>LINKS</Heading>
          </Container>
          {isLoading || !data ? (
            <Skeleton w={'100%'} h={'5rem'} />
          ) : (
            <Container maxW={_containerSize} px={0} _hover={_relatedLinksMainContainerHover} boxShadow={_boxShadow} bg={'white'}>
              {data.relatedLinks.map((link, i) => (
                <Link href={link.url} display={'block'} p={'1rem'} color={_relatedLinksLinkColor} key={i} style={{ textDecoration: 'none' }}>
                  <Box>{link.name}</Box>
                </Link>
              ))}
            </Container>
          )}
        </Box>
      )}
    </Box>
  );
};

ProductDetail.getInitialProps = async ({ query }) => {
  const { id } = query;
  return {
    id: id?.toString(),
  };
};

export default ProductDetail;
