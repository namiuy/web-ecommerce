import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Flex } from '@chakra-ui/react';
import Link from 'next/link';
import { addSearchParamsToUrl, getEmptyArray, getProductsUrl, isBrowser, useCategoryList } from 'shared';
import { Category } from 'shared/entities/category';
import { Skeleton } from 'ui';

const LOADING_LENGTH = 6;

const _grey0 = 'brand.grey.0';
const _grey3 = 'brand.grey.3';
type CategoriesProps = {
  removeParams?: boolean;
  color?: string;
  borderColor?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
};
type ItemProps = {
  id: string;
  name: string;
  color?: string;
  borderColor?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
};

type AccordionItemProps = {
  name: string;
  showIcon: boolean;
  color?: string;
};

const getUrl = (categoryId: string) => (!isBrowser() ? '/' : addSearchParamsToUrl(getProductsUrl(), { c: categoryId }));

const Item = ({ id, name, color = _grey3, borderColor = _grey0, onClick }: ItemProps) => {
  return (
    <Link href={getUrl(id)} onClick={onClick}>
      <Flex
        as="li"
        alignItems="center"
        justifyContent="space-between"
        p="1rem 1rem 1rem 3rem"
        cursor="pointer"
        color={color}
        borderBottom="solid 1px"
        borderColor={borderColor}
        _hover={{ bg: _grey0 }}
      >
        {name}
      </Flex>
    </Link>
  );
};

const AccordionItemCustom = ({ name, color, showIcon }: AccordionItemProps) => (
  <AccordionButton p="1rem 1rem 1rem 2rem">
    <Box as="span" flex="1" textAlign="left" color={color}>
      {name}
    </Box>
    {showIcon && <AccordionIcon color={color} />}
  </AccordionButton>
);

export const CategoriesAccordion = ({
  removeParams,
  color = _grey3,
  borderColor = _grey0,
  onClick,
}: CategoriesProps) => {
  const { isLoading, error, data = [] } = useCategoryList();
  // TODO: removeParams
  if (error) {
    console.log(error);
    return <></>;
  }
  const categories = isLoading ? getEmptyArray<Category>(LOADING_LENGTH) : data;

  return (
    <Accordion allowToggle>
      {categories.map(({ id, name, sub_categories }, i) =>
        isLoading ? (
          <Skeleton key={i} h="2rem" mb="1rem" />
        ) : (
          <AccordionItem key={i} borderColor={i > 0 && i < categories.length ? borderColor : 'transparent'}>
            {!!sub_categories?.length ? (
              <>
                <AccordionItemCustom name={name} color={color} showIcon={!!sub_categories?.length} />
                <AccordionPanel p="0">
                  <Box as="ol" listStyleType="none" p="0">
                    {sub_categories?.map(({ id, name }, ii) => (
                      <Item key={ii} id={id} name={name} color={color} borderColor={borderColor} onClick={onClick} />
                    ))}
                  </Box>
                </AccordionPanel>
              </>
            ) : (
              <Link href={getUrl(id)} onClick={onClick}>
                <AccordionItemCustom name={name} color={color} showIcon={!!sub_categories?.length} />
              </Link>
            )}
          </AccordionItem>
        ),
      )}
    </Accordion>
  );
};
