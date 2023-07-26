import { Icon, Tooltip, Link } from '@chakra-ui/react';
import { Head, Container, Grid, GridItem, Heading, Text, Box, Button } from 'ui';
import { CheckIcon, CloseIcon, PhoneIcon } from '@chakra-ui/icons';
import { BiSolidShoppingBag } from 'react-icons/bi';
import { ImageModal } from 'ui/components/ImageModal';
import { useProductGet } from 'shared';
import { NextPage } from 'next';
import { NavBar } from '../components';
import _ from 'lodash';

const _mainBoxMinHeight = '100vh';

const _containerSize = { lg: '65%', base: '90%' };
const _containerPadding = { lg: '2rem', base: '1rem' };
const _containerMarginTop = '5rem';

const _borderColor = 'brand.productDetail.borderColor';
const _boxShadow = ' 0 3px 5px -1px rgb(0 0 0 / 5%), 0 6px 40px 0 rgb(0 0 0 / 3%), 0 1px 18px 0 rgb(0 0 0 / 2%) ';

const _gridTemplateAreas = { lg: `"image details" "description description"`, base: `"image" "details" "description"` };
const _gridTemplateRows = { lg: 'auto 1fr', base: 'auto 1fr' };
const _gridTemplateColumns = { lg: 'repeat(2, 1fr)', base: 'repeat(1, 1fr)' };
const _gridGap = '1rem';

const _gridItemImagePaddingRight = { lg: '2rem', base: '0' };
const _gridItemImageBorderRight = { lg: '1px', base: '0' };
const _griditemImageBorderColor = { lg: _borderColor, base: 'transparent' };

const _gridIemDetailsPaddingLeft = { lg: '1rem', base: '0' };
const _gridItemDetailsBorderBottom = '1px';
const _gridItemDetailsFontSize = '1.3rem';

const _tooltipBg = 'blackAlpha.700';
const _tooltipFontSize = '0.7rem';
const _tooltipBorderRadius = '0.3rem';

const _smallTextSizeOne = '0.8rem';
const _smallTextSizeTwo = '0.6rem';
const _smallTextSizeThree = '0.75rem';
const _smallTextColor = 'brand.productDetail.smallText';

type ProductDetailProps = {
  id?: string;
};

const ProductDetail: NextPage<ProductDetailProps> = props => {
  const { isLoading, error, data } = useProductGet(props?.id || '');

  if (isLoading || !data) return <>Loading...</>;

  if (error) {
    console.log(error);
    return <></>;
  }

  return (
    <Box minHeight={_mainBoxMinHeight}>
      <Head />
      <NavBar />
      <Box py={'2rem'}></Box>
      <Container maxW={_containerSize} p={_containerPadding} mt={_containerMarginTop} boxShadow={_boxShadow}>
        <Grid
          templateAreas={_gridTemplateAreas}
          templateRows={_gridTemplateRows}
          templateColumns={_gridTemplateColumns}
          gap={_gridGap}
        >
          <GridItem
            area={'image'}
            pr={_gridItemImagePaddingRight}
            borderRight={_gridItemImageBorderRight}
            borderColor={_griditemImageBorderColor}
          >
            <ImageModal image={data.image_url} title={data.brand.name} />
          </GridItem>
          <GridItem area={'details'} pl={_gridIemDetailsPaddingLeft}>
            <Box borderBottom={_gridItemDetailsBorderBottom} borderColor={_borderColor}>
              <Text fontWeight={'extrabold'} fontSize={_gridItemDetailsFontSize}>
                {data.name}
              </Text>
              <Text color={_smallTextColor} fontSize={_smallTextSizeOne}>
                <Text as="span" fontSize={_smallTextSizeTwo}>
                  Cod{' '}
                </Text>
                {data.id}
              </Text>
              <Text pt={'1rem'} pb={'2.5rem'} fontSize={'2.2rem'}>
                <Text as="span" fontSize={'1.7rem'}>
                  U$S{' '}
                </Text>
                {data.price}
                <Text as="span" color={_smallTextColor} fontSize={_smallTextSizeTwo}>
                  {' '}
                  + IVA
                </Text>
              </Text>
            </Box>
            <Box>
              <Text color={_smallTextColor} fontSize={_smallTextSizeThree} py={'1rem'}>
                Stock
                {data.stock === 'AV' && (
                  <Tooltip
                    label="Disponible"
                    bg={_tooltipBg}
                    fontSize={_tooltipFontSize}
                    borderRadius={_tooltipBorderRadius}
                  >
                    <CheckIcon ml={'5px'} boxSize={3} mb={'3px'} />
                  </Tooltip>
                )}
                {data.stock === 'CO' && (
                  <Tooltip
                    label="Consulte"
                    bg={_tooltipBg}
                    fontSize={_tooltipFontSize}
                    borderRadius={_tooltipBorderRadius}
                  >
                    <PhoneIcon ml={'5px'} boxSize={3} mb={'3px'} />
                  </Tooltip>
                )}
                {data.stock === 'NO' && (
                  <Tooltip
                    label="Agotado"
                    bg={_tooltipBg}
                    fontSize={_tooltipFontSize}
                    borderRadius={_tooltipBorderRadius}
                  >
                    <CloseIcon ml={'5px'} boxSize={3} mb={'3px'} />
                  </Tooltip>
                )}
              </Text>
              <Button
                width={'100%'}
                bg={'red.500'}
                color={'white'}
                _hover={{ bg: 'red.700' }}
                isDisabled={data.stock === 'CO' || data.stock === 'NO'}
              >
                COMPRAR <Icon as={BiSolidShoppingBag} ml={'5px'} mb={'3px'} boxSize={4} />
              </Button>
            </Box>
          </GridItem>
          <GridItem area={'description'} borderTop={'1px'} borderColor={_borderColor}>
            <Text pt={'1.5rem'}> {data.description} </Text>
          </GridItem>
        </Grid>
      </Container>
      {data.relatedLinks && (
        <Box my={'4rem'} borderY={'1px'} borderColor={_borderColor} py={'3rem'}>
          <Container maxW={_containerSize} px={0} mb={'2rem'}>
            <Heading size={'lg'}>LINKS</Heading>
          </Container>
          <Container maxW={_containerSize} px={0} _hover={{ bg: 'blue.50' }} boxShadow={_boxShadow}>
            {data.relatedLinks.map((link, i) => (
              <Link href={link.url} display={'block'} p={'1rem'} color={'blue.400'} key={i}>
                <Box>{link.name}</Box>
              </Link>
            ))}
          </Container>
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
