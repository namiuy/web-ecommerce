import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Flex } from '@chakra-ui/react';
import Link from 'next/link';
import { addSearchParamsToUrl, getEmptyArray, getProductsUrl, useCategoryList } from 'shared';
import { Category } from 'shared/entities/category';
import { Skeleton } from 'ui';

const LOADING_LENGTH = 6;

const _grey0 = 'brand.grey.0';
const _grey3 = 'brand.grey.3';

type CategoriesProps = {
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
};

type ItemProps = { id: string; name: string; onClick?: React.MouseEventHandler<HTMLAnchorElement> };

export const Item = ({ id, name, onClick }: ItemProps) => {
  const url = typeof window === 'undefined' ? '/' : addSearchParamsToUrl(getProductsUrl(), { c: id });
  return (
    <Link href={url} onClick={onClick}>
      <Flex
        as="li"
        alignItems="center"
        justifyContent="space-between"
        p="1rem 1rem 1rem 3rem"
        cursor="pointer"
        color={_grey3}
        borderBottom="solid 1px"
        borderColor={_grey0}
        _hover={{ bg: _grey0 }}
      >
        {name}
      </Flex>
    </Link>
  );
};

export const Categories = ({ onClick }: CategoriesProps) => {
  const { isLoading, error, data = [] } = useCategoryList();

  if (error) {
    console.log(error);
    return <></>;
  }

  const categories = isLoading ? getEmptyArray<Category>(LOADING_LENGTH) : data;

  return (
    <Accordion allowToggle>
      {categories.map(({ name, sub_categories }, i) =>
        isLoading ? (
          <Skeleton h="2rem" mb="1rem" />
        ) : (
          <AccordionItem key={i} borderColor={_grey0}>
            <AccordionButton p="1rem 1rem 1rem 2rem">
              <Box as="span" flex="1" textAlign="left">
                {name}
              </Box>
              <AccordionIcon color={_grey3} />
            </AccordionButton>
            <AccordionPanel p="0">
              <Box as="ol" listStyleType="none" p="0">
                {sub_categories?.map(({ id, name }, ii) => (
                  <Item key={ii} id={id} name={name} onClick={onClick} />
                ))}
              </Box>
            </AccordionPanel>
          </AccordionItem>
        )
      )}
    </Accordion>
  );
};
