/* eslint-disable react-hooks/exhaustive-deps */
import lscache from 'lscache';
import {
  Link,
  useDisclosure,
  Flex,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useBreakpointValue,
  Divider,
  AspectRatio,
} from '@chakra-ui/react';
import {
  Container,
  Grid,
  GridItem,
  Heading,
  Text,
  Box,
  Skeleton,
  ImageModal,
  Card,
  AddToCartButton,
  QuoteRequestButton,
  ProductListSection,
} from 'ui';
import { WhatsAppRequestButton } from '../components/WhatsAppRequestButton';
import { isBrowser, useProductGet, product as productConf } from 'shared';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Product } from 'shared/entities/product';
import { ButtonEdit } from '../components/ButtonEdit';
import { ProductEditModal } from '../components/ProductCard/ProductEditModal';
import { User } from 'shared/entities/user';
import { ProductStock } from '../components/ProductStock';

const { afterPriceText } = productConf;

const _background = 'brand.background';
const _borderColor = 'brand.productDetail.borderColor';
const _smallTextColor = 'brand.productDetail.smallText';
const _relatedLinksLinkColor = 'brand.productDetail.relatedLinks.linkColor';
const _relatedLinksMainContainerHover = 'blue.50';

const _mainBoxPaddingY = { lg: '3rem', base: '2rem' };

const _containerSize = { lg: '75%', base: '90%' };
const _containerPadding = { lg: '2rem', base: '1rem' };

const _gridTemplateAreas = { lg: `"image details" "description description"`, base: `"image" "details" "description"` };
const _gridTemplateRows = { lg: 'auto 1fr', base: 'auto 1fr' };
const _gridTemplateColumns = { lg: '3fr 2fr', base: '1fr' };
const _gridItemBorderColor = { lg: _borderColor, base: 'transparent' };

const _gridItemImagePaddingBottom = { lg: '0', base: '1rem' };
const _gridItemImagePaddingRight = { lg: '1.5rem', base: '0' };
const _gridItemImageSkeletonMarginBottom = { lg: '0', base: '1rem' };

const _gridItemDetailsBorderLeft = { lg: '1px', base: '0' };
const _gridIemDetailsPaddingLeft = { lg: '2rem', base: '0' };

const _descriptionMarginTop = { lg: '2rem', base: '0' };

export type ProductActionProps = {
  isLoading: boolean;
  product?: Product;
};

type ProductAction = 'add_to_cart' | 'quote_request' | 'whatsapp_request';

type ProductDetailProps = {
  id: string;
  actions: ProductAction[];
};

const getAction = (action: ProductAction, props: ProductActionProps) => {
  if (action === 'add_to_cart') return <AddToCartButton key={action} {...props} />;
  if (action === 'quote_request') return <QuoteRequestButton key={action} {...props} />;
  if (action === 'whatsapp_request') return <WhatsAppRequestButton key={action} {...props} />;
  return <></>;
};

export const ProductDetail = ({ id, actions = [] }: ProductDetailProps) => {
  const router = useRouter();
  const issBrowser = isBrowser();
  const [user, setUser] = useState<User>();
  const isUserAdmin = user?.roles?.includes('admin'); // TODO: improve this
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isLoading, error, data } = useProductGet(id);
  // const { error, data } = useProductGet(id);
  // const [isLoading, setIsLoading] = useState(true);

  const isMobile = useBreakpointValue({ base: true, sm: false });

  useEffect(() => {
    if (issBrowser) setUser(lscache.get('user')); // TODO: improve this
  }, [issBrowser]);

  useEffect(() => {
    if (!isLoading && !data?.id) router.replace('/productos'); // TODO: improve this
  }, [data]);

  if (error) {
    console.log(error);
    return <></>;
  }

  return (
    <Box bg={_background} py={_mainBoxPaddingY}>
      <Container maxW={_containerSize} px="0">
        {data && (
          <Flex justifyContent="space-between" alignItems="center">
            <Skeleton isLoaded={!isLoading}>
              <Box color={'brand.grey.2'} fontSize="0.875rem" fontWeight="medium">
                <Link onClick={() => router.back()} _hover={{ textDecoration: 'none' }}>
                  Volver
                </Link>
                <Text as="span" px="0.375rem">
                  {' '}
                  |{' '}
                </Text>
                <Link href={`/productos?c=${data?.category.id}`} _hover={{ textDecoration: 'none' }}>
                  {' '}
                  {data?.category.name}
                </Link>
              </Box>
            </Skeleton>
            {true && ( //fix: isUserAdmin
              <Box>
                <ButtonEdit onClick={onOpen} />
                <ProductEditModal isOpen={isOpen} product={data} onOpen={onOpen} onClose={onClose} />
              </Box>
            )}
          </Flex>
        )}
      </Container>
      <Card maxW={_containerSize} p={_containerPadding} m="0 auto 3.5rem auto">
        <Grid
          templateAreas={_gridTemplateAreas}
          templateRows={_gridTemplateRows}
          templateColumns={_gridTemplateColumns}
        >
          <GridItem
            w="100%"
            area="image"
            placeSelf="center"
            pb={_gridItemImagePaddingBottom}
            pr={_gridItemImagePaddingRight}
          >
            <AspectRatio ratio={{ base: 4 / 3, md: 1, lg: 4 / 3 }}>
              <ImageModal
                image={data ? data.image_url : 'undefined'}
                title={data ? data.brand.name : 'undefined'}
                isMobile={!!isMobile}
              />
            </AspectRatio>
          </GridItem>
          <GridItem
            area="details"
            pl={_gridIemDetailsPaddingLeft}
            borderLeft={_gridItemDetailsBorderLeft}
            borderColor={_gridItemBorderColor}
          >
            <Box borderBottom="1px" borderColor={_borderColor} pb="1rem">
              <Skeleton isLoaded={!isLoading} mb="0.375rem">
                <Text fontWeight="bold" fontSize="1.5rem">
                  {data?.name}
                </Text>
              </Skeleton>

              <Skeleton isLoaded={!isLoading} w="35%" mb="1.25rem">
                <Text color={_smallTextColor} fontSize="0.75rem">
                  <Text as="span" fontSize="0.625rem">
                    Codigo{' '}
                  </Text>
                  {data?.id}
                </Text>
              </Skeleton>
              <Skeleton isLoaded={!isLoading} w="15rem" mb="0.5rem">
                <Text fontSize="2.5rem" fontWeight="medium">
                  <Text as="span" fontSize="1.875rem">
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
              </Skeleton>
            </Box>
            <Box pb="1.5rem" pt="1rem">
              <Skeleton isLoaded={!isLoading}>
                <ProductStock id={id} />
              </Skeleton>
              {/* <Skeleton isLoaded={!isLoading} w="50%" mb="1.75rem">
                <Flex alignItems="center">
                  <Text mr="0.75rem" color={_smallTextColor}>
                    Cantidad
                  </Text>
                  <NumberInput size="xs" maxW={20} defaultValue={1} min={1}>
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </Flex>
              </Skeleton> */}
              <>{actions.map(a => getAction(a, { isLoading, product: data }))}</>
            </Box>
          </GridItem>
          {data?.description && (
            <GridItem
              area="description"
              borderTop="1px"
              borderColor={_borderColor}
              mt={_descriptionMarginTop}
              pt="2rem"
            >
              <Skeleton isLoaded={!isLoading}>
                <Text lineHeight="1.5rem" textAlign="justify">
                  {data.description.split('. ').map((linea, i) => (
                    <Text as="span" key={i}>
                      {'-'}
                      {linea}
                      <br />
                    </Text>
                  ))}
                </Text>
              </Skeleton>
            </GridItem>
          )}
        </Grid>
      </Card>
      {data?.specifications && (
        <>
          <Divider />
          <Box mt="2.5rem" mb="3.5rem">
            <Container maxW={_containerSize} px="0" mb="1.5rem">
              <Heading size="lg">ESPECIFICACIONES</Heading>
            </Container>
            <Card maxW={_containerSize} mx="auto">
              <Skeleton isLoaded={!isLoading}>
                <Box>
                  {data.specifications.map((spec, i) => (
                    <Box key={i}>
                      {i != 0 && <Divider />}
                      <Flex py="0.75rem" pl="1rem" flexDir={{ base: 'column', md: 'row' }}>
                        <Text w={{ base: '100%', md: '50%' }} pb={{ base: '0.25rem', md: '0' }} fontWeight="medium">
                          {spec.name}
                        </Text>
                        <Text w={{ base: '100%', md: '50%' }}>{spec.value}</Text>
                      </Flex>
                    </Box>
                  ))}
                </Box>
              </Skeleton>
            </Card>
          </Box>
          <Divider />
        </>
      )}
      {data?.related_links && (
        <>
          <Box mt="2.5rem" mb="3.5rem">
            <Container maxW={_containerSize} px={0} mb="1.5rem">
              <Heading size="lg">LINKS</Heading>
            </Container>
            <Card maxW={_containerSize} mx="auto">
              <Skeleton isLoaded={!isLoading}>
                {data.related_links.map((link, i) => (
                  <Box key={i}>
                    {i != 0 && <Divider />}
                    <Link
                      href={link.url}
                      target="_blank"
                      display="block"
                      py="0.75rem"
                      pl="1rem"
                      color={_relatedLinksLinkColor}
                      _hover={{ textDecoration: 'none', bg: _relatedLinksMainContainerHover }}
                    >
                      <Box>{link.name}</Box>
                    </Link>
                  </Box>
                ))}
              </Skeleton>
            </Card>
          </Box>
        </>
      )}
      {/* <ProductListSection name="home_b" /> */} {/* Preguntarle a nacho como se hace esto */}
    </Box>
  );
};
