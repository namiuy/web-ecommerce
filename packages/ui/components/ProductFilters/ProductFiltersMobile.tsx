import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Drawer as DrawerChakra,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  DrawerProps,
  Flex,
  Skeleton,
  Tag,
  TagCloseButton,
  TagLabel,
  useDisclosure,
} from '@chakra-ui/react';
import Link from 'next/link';
import { MouseEventHandler } from 'react';
import { IconType } from 'react-icons';
import { BiSortAlt2 } from 'react-icons/bi';
import { MdTune } from 'react-icons/md';
import { Brand } from 'shared/entities/brand';
import { Category } from 'shared/entities/category';
import { addSearchParamsToUrl, removeSearchParamFromUrl } from 'shared/utils/url';
import { getProductsUrl, ProductFiltersProps } from '.';

const _color = 'brand.productFilters.color';
const _selectedBackgroundColor = 'brand.productFilters.selected.backgroundColor';
const _selectedColor = 'brand.productFilters.selected.color';
const _fontSize = '0.875rem';

type ItemProps = {
  isSecondLevel?: boolean;
  isLoading?: boolean;
  content: string;
  productFiltersProps: ProductFiltersProps;
  params: Record<string, string | undefined>;
  onClick: MouseEventHandler<HTMLAnchorElement>;
};

type SelectedItem = {
  paramKey: string;
  content: string;
};

type ProductFiltersDesktopProps = {
  originalProps: ProductFiltersProps;
  brandsIsLoading: boolean;
  categoriesIsLoading: boolean;
  selectedBrand?: Brand;
  selectedCategory?: Category;
  brands: Array<Brand>;
  categories: Array<Category>;
};

type OptionProps = {
  content: string;
  icon: IconType;
  onClick: MouseEventHandler;
};

const Item = ({
  isSecondLevel = false,
  isLoading = false,
  content,
  params,
  productFiltersProps: { brandId, categoryId },
  onClick,
}: ItemProps) => {
  if (isLoading) {
    return <Skeleton w="6rem" h="1rem" mb="1rem" />;
  }

  const url =
    typeof window === 'undefined'
      ? '/'
      : addSearchParamsToUrl(getProductsUrl(), { b: brandId?.toString(), c: categoryId, ...params });

  return (
    <Box as="li" pl={isSecondLevel ? '1rem' : '0'} pb="1rem" pr="1rem" fontSize={_fontSize} lineHeight="1rem">
      <Link href={url} onClick={onClick}>
        {content}
      </Link>
    </Box>
  );
};

const SelectedItem = ({ paramKey, content }: SelectedItem) => {
  const url = typeof window === 'undefined' ? '/' : removeSearchParamFromUrl(getProductsUrl(), paramKey);

  return (
    <Tag
      variant="solid"
      bg={_selectedBackgroundColor}
      m="0 1rem 1rem 0"
      fontSize={_fontSize}
      height="1rem"
      borderRadius="1rem"
      width="fit-content"
    >
      <TagLabel color={_selectedColor}>{content}</TagLabel>
      <Link href={url}>
        <TagCloseButton color="black" />
      </Link>
    </Tag>
  );
};

const Option = ({ content, icon: Icon, onClick }: OptionProps) => (
  <Button w="100%" size="md" p="1rem" variant="link" color={_color} leftIcon={<Icon />} onClick={onClick}>
    {content}
  </Button>
);

export const Drawer = ({ isOpen, children, onClose }: DrawerProps) => (
  <DrawerChakra isOpen={isOpen} placement="bottom" size="full" onClose={onClose}>
    <DrawerOverlay />
    <DrawerContent>
      <DrawerCloseButton />
      <DrawerBody p="3rem 0 0">{children}</DrawerBody>
    </DrawerContent>
  </DrawerChakra>
);

export const ProductFiltersMobile = ({
  originalProps,
  brandsIsLoading,
  categoriesIsLoading,
  selectedBrand,
  selectedCategory,
  brands,
  categories,
}: ProductFiltersDesktopProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Flex direction="column">
      <Flex>
        <Option content="Ordenar" icon={BiSortAlt2} onClick={() => {}} />
        <Option content="Filtrar" icon={MdTune} onClick={onOpen} />
      </Flex>
      <Flex p="1rem">
        {selectedCategory && <SelectedItem paramKey="c" content={selectedCategory.name} />}
        {selectedBrand && <SelectedItem paramKey="b" content={selectedBrand.name} />}
      </Flex>
      <Drawer isOpen={isOpen} onClose={onClose}>
        <Accordion allowToggle>
          {!selectedCategory && (
            <AccordionItem>
              <AccordionButton>
                <Box as="span" flex="1" textAlign="left">
                  Categoria
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel>
                <Box as="ol" listStyleType="none">
                  {categories.map(({ id, name, is_sub_category }, i) => (
                    <Item
                      isSecondLevel={is_sub_category}
                      key={i}
                      isLoading={categoriesIsLoading}
                      content={name}
                      productFiltersProps={originalProps}
                      params={{ c: id }}
                      onClick={onClose}
                    />
                  ))}
                </Box>
              </AccordionPanel>
            </AccordionItem>
          )}
          {!selectedBrand && (
            <AccordionItem>
              <AccordionButton>
                <Box as="span" flex="1" textAlign="left">
                  Marca
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel>
                <Box as="ol" listStyleType="none">
                  {brands.map(({ id, name }, i) => (
                    <Item
                      key={i}
                      isLoading={brandsIsLoading}
                      content={name}
                      productFiltersProps={originalProps}
                      params={{ b: id?.toString() }}
                      onClick={onClose}
                    />
                  ))}
                </Box>
              </AccordionPanel>
            </AccordionItem>
          )}
        </Accordion>
      </Drawer>
    </Flex>
  );
};
