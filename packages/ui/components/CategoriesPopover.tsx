import { Box, Flex, Popover, PopoverBody, PopoverContent, PopoverTrigger } from '@chakra-ui/react';
import { Category } from 'shared/entities/category';
import { Skeleton } from 'ui';
import { addSearchParamsToUrl, getEmptyArray, getProductsUrl, isBrowser, useCategoryList } from 'shared';
import Link from 'next/link';

import { MdKeyboardArrowRight } from 'react-icons/md';

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
  sub_categories?: boolean;
  /* sub_categories?: boolean; */
};

const getUrl = (categoryId: string) => (!isBrowser() ? '/' : addSearchParamsToUrl(getProductsUrl(), { c: categoryId }));

const Item = ({ id, name, color = _grey3, borderColor = _grey0, sub_categories = false, onClick }: ItemProps) => {
  return (
    <Link href={getUrl(id)} onClick={onClick}>
      <Flex
        w="100%"
        h="2rem"
        p="1.5rem"
        color={color}
        borderColor={borderColor}
        justifyContent="space-between"
        alignItems="center"
        borderRadius="0"
        fontWeight="normal"
        _hover={{ bg: 'gray.200' }}
      >
        {name}
        {sub_categories && <MdKeyboardArrowRight />}
      </Flex>
    </Link>
  );
};

export const CategoriesPopover = ({ removeParams, color = _grey3, borderColor = _grey0, onClick }: CategoriesProps) => {
  const { isLoading, error, data = [] } = useCategoryList();
  // TODO: removeParams

  if (error) {
    console.log(error);
    return <></>;
  }

  const categories = isLoading ? getEmptyArray<Category>(LOADING_LENGTH) : data;

  return (
    <>
      {categories.map(({ id, name, sub_categories }, i) =>
        isLoading ? (
          <Skeleton key={i} h="2rem" mb="1rem" />
        ) : (
          <Box>
            <Popover key={i} placement="right-start" trigger="hover" gutter={0}>
              <PopoverTrigger>
                <Box>
                  <Item
                    id={id}
                    name={name}
                    color={color}
                    borderColor={borderColor}
                    onClick={onClick}
                    sub_categories={sub_categories != null}
                  />
                </Box>
              </PopoverTrigger>
              <PopoverContent w="max-content">
                <PopoverBody padding="0">
                  {sub_categories?.map(({ id, name }, ii) => (
                    <Item key={ii} id={id} name={name} color={color} borderColor={borderColor} onClick={onClick} />
                  ))}
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </Box>
        ),
      )}
    </>
  );
};
