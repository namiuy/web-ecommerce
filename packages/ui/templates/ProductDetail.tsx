'use client';

import lscache from 'lscache';
import { Tooltip, Link, useDisclosure, Flex } from '@chakra-ui/react';
import {
  Container,
  Grid,
  GridItem,
  Heading,
  Text,
  Box,
  Skeleton,
  ImageModal,
  AddToCartButton,
  QuoteRequestButton,
  Card,
} from 'ui';
import { CheckIcon, CloseIcon, PhoneIcon } from '@chakra-ui/icons';
import { isBrowser, useProductGet } from 'shared';
import { useRouter } from 'next/router';
import { FC, useEffect, useState } from 'react';
import { Product } from 'shared/entities/product';
import { product as productConf } from 'shared';
import { ButtonEdit } from '../components/ButtonEdit';
import { ProductEditModal } from '../components/ProductCard/ProductEditModal';
import { User } from 'shared/entities/user';

const { afterPriceText } = productConf;

const _grey2 = 'brand.grey.2';

const _borderColor = 'brand.productDetail.borderColor';
const _returnLinkHoverColor = { color: 'brand.productDetail.linkColor' };

const _containerSize = { lg: '65%', base: '90%' };
const _containerPadding = { lg: '2rem 2rem 3rem 2rem', base: '1rem' };

const _gridTemplateAreas = { lg: `"image details" "description description"`, base: `"image" "details" "description"` };
const _gridTemplateRows = { lg: 'auto 1fr', base: 'auto 1fr' };
const _gridTemplateColumns = { lg: '3fr 2fr', base: 'repeat(1, 1fr)' };

const _gridItemImagePaddingRight = { lg: '2rem', base: '0' };
const _gridItemImageBorderRight = { lg: '1px', base: '0' };
const _griditemImageBorderColor = { lg: _borderColor, base: 'transparent' };

const _gridIemDetailsPaddingLeft = { lg: '2rem', base: '0' };

const _smallTextColor = 'brand.productDetail.smallText';

const _tooltipBg = 'brand.productDetail.tooltipBg';

const _stockIcon = { ml: '5px', boxSize: 3, mb: '3px' };

const _relatedLinksMainContainerHover = { bg: 'blue.50' };
const _relatedLinksLinkColor = 'brand.productDetail.linkColor';

const _imageSkeletonMarginBottom = { lg: '0', base: '1rem' };

export type ProductActionProps = {
  isLoading: boolean;
  product?: Product;
};

type ProductAction = 'add_to_cart' | 'quote_request';

type ProductDetailProps = {
  id: string;
  actions: ProductAction[];
};

const getAction = (action: ProductAction, props: ProductActionProps) => {
  if (action === 'add_to_cart') return <AddToCartButton key={action} {...props} />;
  if (action === 'quote_request') return <QuoteRequestButton key={action} {...props} />;
  return <></>;
};

export const ProductDetail: FC<ProductDetailProps> = ({ id, actions = [] }) => {
  const issBrowser = isBrowser();
  const [user, setUser] = useState<User>();
  const isUserAdmin = user?.roles?.includes('admin'); // TODO: improve this
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isLoading, error, data } = useProductGet(id);
  const router = useRouter();

  useEffect(() => {
    if (issBrowser) setUser(lscache.get('user')); // TODO: improve this
  }, [issBrowser]);

  if (error) {
    console.log(error);
    return <></>;
  }

  return (
    <>
      <Container maxW={_containerSize} px="0" margin="auto" pt={{ lg: '3rem', base: '1.5rem' }} mb="0.25rem">
        <Flex justifyContent="space-between">
          <Flex fontSize="0.875rem" color={_grey2}>
            {isLoading ? (
              <Skeleton w="30%" h="1.25rem" />
            ) : (
              <Box>
                <Link onClick={() => router.back()} style={{ textDecoration: 'none' }} _hover={_returnLinkHoverColor}>
                  Volver
                </Link>
                <Text as="span" mx="0.375rem">
                  {' '}
                  |{' '}
                </Text>

                <Link
                  href={`/productos?c=${data?.category.id}`}
                  style={{ textDecoration: 'none' }}
                  _hover={_returnLinkHoverColor}
                >
                  {' '}
                  {data?.category.name}
                </Link>
              </Box>
            )}
          </Flex>
          {isUserAdmin && (
            <Box>
              <ButtonEdit onClick={onOpen} />
              <ProductEditModal isOpen={isOpen} product={data} onOpen={onOpen} onClose={onClose} />
            </Box>
          )}
        </Flex>
      </Container>
      <Card m="auto" maxW={_containerSize} p={_containerPadding} size="md">
        <Grid
          templateAreas={_gridTemplateAreas}
          templateRows={_gridTemplateRows}
          templateColumns={_gridTemplateColumns}
        >
          <GridItem
            area="image"
            pr={_gridItemImagePaddingRight}
            borderRight={_gridItemImageBorderRight}
            borderColor={_griditemImageBorderColor}
          >
            {isLoading ? (
              <Skeleton w="100%" h="26rem" mb={_imageSkeletonMarginBottom} />
            ) : data ? (
              <ImageModal image={data?.image_url} title={data?.brand.name} />
            ) : (
              <></>
            )}
          </GridItem>
          <GridItem area="details" pl={_gridIemDetailsPaddingLeft}>
            <Box>
              {isLoading ? (
                <Skeleton w="100%" h="2.25rem" mb="0.375rem" />
              ) : (
                <Text fontWeight="extrabold" fontSize="1.5rem">
                  {data?.name}
                </Text>
              )}
              {isLoading ? (
                <Skeleton w="20%" h="1.25rem" mb="1.5rem" />
              ) : (
                <Text color={_smallTextColor} fontSize="0.75rem">
                  <Text as="span" fontSize="0.625rem">
                    Codigo{' '}
                  </Text>
                  {data?.id}
                </Text>
              )}
              {isLoading ? (
                <Skeleton w="50%" h="3.375rem" mb="3rem" />
              ) : (
                <Text pt="1rem" pb="2rem" fontSize="2.25rem">
                  <Text as="span" fontSize="1.625rem">
                    U$S{' '}
                  </Text>
                  {data?.price}
                  {afterPriceText && (
                    <Text as="span" color={_smallTextColor} fontSize="0.75rem">
                      {' '}
                      {afterPriceText}
                    </Text>
                  )}
                </Text>
              )}
            </Box>
            <Box>
              {isLoading ? (
                <Skeleton w="7%" h="1rem" my="1rem" />
              ) : data?.stock ? (
                <Text color={_smallTextColor} fontSize="0.75rem" py="1rem">
                  Stock
                  {data?.stock === 'AV' && (
                    <Tooltip label="Disponible" bg={_tooltipBg} fontSize="0.75rem" borderRadius="0.25rem">
                      <CheckIcon sx={_stockIcon} />
                    </Tooltip>
                  )}
                  {data?.stock === 'CO' && (
                    <Tooltip label="Consulte" bg={_tooltipBg} fontSize="0.75rem" borderRadius="0.25rem">
                      <PhoneIcon sx={_stockIcon} />
                    </Tooltip>
                  )}
                  {data?.stock === 'NO' && (
                    <Tooltip label="Agotado" bg={_tooltipBg} fontSize="0.75rem" borderRadius="0.25rem">
                      <CloseIcon sx={_stockIcon} />
                    </Tooltip>
                  )}
                </Text>
              ) : (
                <></>
              )}
              {isLoading ? (
                <Skeleton w="100%" h="2.5rem" />
              ) : (
                <>{actions.map(a => getAction(a, { isLoading, product: data }))}</>
              )}
            </Box>
          </GridItem>
          {(isLoading || (data && data?.description)) && (
            <GridItem area="description" borderTop="1px" borderColor={_borderColor} mt="2rem" pt="2rem">
              {isLoading ? (
                <Skeleton w="70%" h="2rem" />
              ) : (
                <Text lineHeight="2rem">
                  {data?.description?.split('\n').map((linea, i) => (
                    <>
                      {linea}
                      <br />
                    </>
                  ))}
                </Text>
              )}
            </GridItem>
          )}
        </Grid>
      </Card>
      {data && data?.relatedLinks && (
        <Box my="4rem" py="3rem" borderY="1px" borderColor={_borderColor}>
          <Container maxW={_containerSize} px={0} mb="2rem">
            <Heading size="lg">LINKS</Heading>
          </Container>
          {isLoading ? (
            <Skeleton w="100%" h="5rem" />
          ) : (
            <Card maxW={_containerSize} px={0} _hover={_relatedLinksMainContainerHover} size="md">
              {data?.relatedLinks.map((link, i) => (
                <Link
                  href={link.url}
                  display="block"
                  p="1rem"
                  color={_relatedLinksLinkColor}
                  key={i}
                  style={{ textDecoration: 'none' }}
                >
                  <Box>{link.name}</Box>
                </Link>
              ))}
            </Card>
          )}
        </Box>
      )}
    </>
  );
};
