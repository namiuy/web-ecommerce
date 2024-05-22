import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  ModalOverlay,
  Flex,
  Skeleton,
  Tag,
  TagCloseButton,
  TagLabel,
  useDisclosure,
  Modal,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  ModalProps,
} from '@chakra-ui/react';
import Link from 'next/link';
import { MouseEventHandler } from 'react';
import { IconType } from 'react-icons';
import { MdTune } from 'react-icons/md';
import { Brand } from 'shared/entities/brand';
import { Category } from 'shared/entities/category';
import { addSearchParamsToUrl, getProductsUrl, removeSearchParamFromUrl } from 'shared/utils/url';
import { ProductFiltersProps } from '.';
import { isBrowser } from 'shared';

const _color = 'brand.productFilters.color';
const _selectedBackgroundColor = 'brand.productFilters.selected.backgroundColor';
const _selectedColor = 'brand.productFilters.selected.color';
const _fontSize = '1rem';

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
  onClick?: MouseEventHandler;
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

  const url = !isBrowser()
    ? '/'
    : addSearchParamsToUrl(getProductsUrl(), { b: brandId?.toString(), c: categoryId, ...params });

  return (
    <Link href={url} onClick={onClick}>
      <Box as="li" pl={isSecondLevel ? '1rem' : '0'} pb="1rem" pr="1rem" fontSize={_fontSize} lineHeight="1rem">
        {content}
      </Box>
    </Link>
  );
};

const SelectedItem = ({ paramKey, content }: SelectedItem) => {
  const url = !isBrowser() ? '/' : removeSearchParamFromUrl(getProductsUrl(), paramKey);

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
  <Button w="100%" size="md" mt="1rem" p="1rem" variant="link" color={_color} leftIcon={<Icon />} onClick={onClick}>
    {content}
  </Button>
);

export const FiltersModal = ({ isOpen, children, onClose }: ModalProps) => (
  <Modal isOpen={isOpen} size="full" onClose={onClose}>
    <ModalOverlay />
    <ModalContent>
      <ModalCloseButton />
      <ModalBody p="4rem 0 1rem 0">{children}</ModalBody>
    </ModalContent>
  </Modal>
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
  const hasSomeFilter = selectedCategory || selectedBrand;
  const hasAllFilters = selectedCategory && selectedBrand;
  return (
    <Flex direction="column">
      <Flex>
        {/* <Option content="Ordenar" icon={BiSortAlt2} onClick={() => {}} /> */}
        <Option content="Filtrar" icon={MdTune} onClick={hasAllFilters ? undefined : onOpen} />
      </Flex>
      {hasSomeFilter && (
        <Flex p="1rem 0">
          {selectedCategory && <SelectedItem paramKey="c" content={selectedCategory.name} />}
          {selectedBrand && <SelectedItem paramKey="b" content={selectedBrand.name} />}
        </Flex>
      )}
      <FiltersModal isOpen={isOpen} onClose={onClose}>
        <Accordion allowToggle>
          {!selectedCategory && (
            <AccordionItem>
              <AccordionButton>
                <Box as="span" flex="1" textAlign="left" fontWeight="bold">
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
                <Box as="span" flex="1" textAlign="left" fontWeight="bold">
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
      </FiltersModal>
    </Flex>
  );
};
