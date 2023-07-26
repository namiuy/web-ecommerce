import { Icon, Tooltip, Link } from '@chakra-ui/react';
import { Head, Container, Grid, GridItem, Heading, Text, Box, Button } from 'ui';
import { CheckIcon, CloseIcon, PhoneIcon } from '@chakra-ui/icons';
import { BiSolidShoppingBag } from 'react-icons/bi';
import { ImageModal } from 'ui/components/ImageModal';
import { useProductGet } from 'shared';
import { NextPage } from 'next';
import { NavBar } from '../components';
import { useRouter } from 'next/router';
import _ from 'lodash';

const _mainBoxMinHeight = '100vh';
const _emptyBoxPaddingY = '2rem';

const _returnLinkHoverColor = { color: 'brand.productDetail.linkColor' };
const _returnLinkFontSize = '0.95rem';
const _returnLinkMarginBottom = '0.3rem';
const _returnLinkMarginTop = '5rem';

const _containerSize = { lg: '65%', base: '90%' };
const _containerPadding = { lg: '2rem', base: '1rem' };

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
const _gridItemDetailsTitleFontWeight = 'extrabold';
const _gridItemDetailsTitleFontSize = '1.3rem';
const _gridItemDetailsCodeSmallFontSize = '0.6rem';
const _gridItemDetailsCodeFontSize = '0.8rem';
const _gridItemDetailsCurrencyFontSize = '1.7rem';
const _gridItemDetailsPricePaddingTop = '1rem';
const _gridItemDetailsPricePaddingBottom = '2.5rem';
const _gridItemDetailsPriceFontSize = '2.2rem';
const _gridItemDetailsTaxFontSize = '0.7rem';
const _gridItemDetailsStockPaddingY = '1rem';
const _gridItemDetailsStockFontSize = '0.75rem';
const _gridItemDetailsBuyButtonWidth = '100%';
const _gridItemDetailsBuyButtonColors = { bg: 'red.500', color: 'white', _hover: { bg: 'red.700' } };

const _gridItemDescriptionBorderTop = '1px';
const _gridItemDescriptionPaddingTop = '1.5rem';
const _smallTextColor = 'brand.productDetail.smallText';

const _tooltipBg = 'brand.productDetail.tooltipBg';
const _tooltipFontSize = '0.7rem';
const _tooltipBorderRadius = '0.3rem';

const _stockIcon = { ml: '5px', boxSize: 3, mb: '3px' };
const _shoppingBagIcon = { ml: '5px', boxSize: 4, mb: '3px' };

const _relatedLinksMarginY = '4rem';
const _relatedLinksPaddingY = '3rem';
const _relatedLinksBorderY = '1px';
const _relatedLinksTitleContainerMarginBottom = '2rem';
const _relatedLinksHeadingSize = 'lg';
const _relatedLinksMainContainerHover = { bg: 'blue.50' };
const _relatedLinksLinkDisplay = 'block';
const _relatedLinksLinkPadding = '1rem';
const _relatedLinksLinkColor = 'brand.productDetail.linkColor';

type ProductDetailProps = {
  id?: string;
};

const ProductDetail: NextPage<ProductDetailProps> = props => {
  const { isLoading, error, data } = useProductGet(props?.id || '');
  const router = useRouter();

  if (isLoading || !data) return <>Loading...</>;

  if (error) {
    console.log(error);
    return <></>;
  }

  return (
    <Box minHeight={_mainBoxMinHeight}>
      <Head />
      <NavBar />
      <Box py={_emptyBoxPaddingY}></Box>
      <Container maxW={_containerSize} px={0} mt={_returnLinkMarginTop} mb={_returnLinkMarginBottom} fontSize={_returnLinkFontSize}>
        <Link onClick={() => router.back()} fontWeight={'bold'} style={{ textDecoration: 'none' }} _hover={_returnLinkHoverColor}>
          Volver
        </Link>
        <Text as="span" mx={'0.4rem'}>
          {' '}
          |{' '}
        </Text>
        <Text display={'inline'}> {data.category.name}</Text>
      </Container>
      <Container maxW={_containerSize} p={_containerPadding} boxShadow={_boxShadow}>
        <Grid templateAreas={_gridTemplateAreas} templateRows={_gridTemplateRows} templateColumns={_gridTemplateColumns} gap={_gridGap}>
          <GridItem area={'image'} pr={_gridItemImagePaddingRight} borderRight={_gridItemImageBorderRight} borderColor={_griditemImageBorderColor}>
            <ImageModal image={data.image_url} title={data.brand.name} />
          </GridItem>
          <GridItem area={'details'} pl={_gridIemDetailsPaddingLeft}>
            <Box borderBottom={_gridItemDetailsBorderBottom} borderColor={_borderColor}>
              <Text fontWeight={_gridItemDetailsTitleFontWeight} fontSize={_gridItemDetailsTitleFontSize}>
                {data.name}
              </Text>
              <Text color={_smallTextColor} fontSize={_gridItemDetailsCodeFontSize}>
                <Text as="span" fontSize={_gridItemDetailsCodeSmallFontSize}>
                  Cod{' '}
                </Text>
                {data.id}
              </Text>
              <Text pt={_gridItemDetailsPricePaddingTop} pb={_gridItemDetailsPricePaddingBottom} fontSize={_gridItemDetailsPriceFontSize}>
                <Text as="span" fontSize={_gridItemDetailsCurrencyFontSize}>
                  U$S{' '}
                </Text>
                {data.price}
                <Text as="span" color={_smallTextColor} fontSize={_gridItemDetailsTaxFontSize}>
                  {' '}
                  + IVA
                </Text>
              </Text>
            </Box>
            <Box>
              <Text color={_smallTextColor} fontSize={_gridItemDetailsStockFontSize} py={_gridItemDetailsStockPaddingY}>
                Stock
                {data.stock === 'AV' && (
                  <Tooltip label="Disponible" bg={_tooltipBg} fontSize={_tooltipFontSize} borderRadius={_tooltipBorderRadius}>
                    <CheckIcon sx={_stockIcon} />
                  </Tooltip>
                )}
                {data.stock === 'CO' && (
                  <Tooltip label="Consulte" bg={_tooltipBg} fontSize={_tooltipFontSize} borderRadius={_tooltipBorderRadius}>
                    <PhoneIcon sx={_stockIcon} />
                  </Tooltip>
                )}
                {data.stock === 'NO' && (
                  <Tooltip label="Agotado" bg={_tooltipBg} fontSize={_tooltipFontSize} borderRadius={_tooltipBorderRadius}>
                    <CloseIcon sx={_stockIcon} />
                  </Tooltip>
                )}
              </Text>
              <Button width={_gridItemDetailsBuyButtonWidth} sx={_gridItemDetailsBuyButtonColors} isDisabled={data.stock === 'CO' || data.stock === 'NO'}>
                COMPRAR <Icon as={BiSolidShoppingBag} sx={_shoppingBagIcon} />
              </Button>
            </Box>
          </GridItem>
          <GridItem area={'description'} borderTop={_gridItemDescriptionBorderTop} borderColor={_borderColor} pt={_gridItemDescriptionPaddingTop}>
            <Text> {data.description} </Text>
          </GridItem>
        </Grid>
      </Container>
      {data.relatedLinks && (
        <Box my={_relatedLinksMarginY} py={_relatedLinksPaddingY} borderY={_relatedLinksBorderY} borderColor={_borderColor}>
          <Container maxW={_containerSize} px={0} mb={_relatedLinksTitleContainerMarginBottom}>
            <Heading size={_relatedLinksHeadingSize}>LINKS</Heading>
          </Container>
          <Container maxW={_containerSize} px={0} _hover={_relatedLinksMainContainerHover} boxShadow={_boxShadow}>
            {data.relatedLinks.map((link, i) => (
              <Link
                href={link.url}
                display={_relatedLinksLinkDisplay}
                p={_relatedLinksLinkPadding}
                color={_relatedLinksLinkColor}
                key={i}
                style={{ textDecoration: 'none' }}
              >
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
