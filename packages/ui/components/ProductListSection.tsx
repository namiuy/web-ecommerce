import lscache from 'lscache';
import { Flex /*, IconButton, useDisclosure*/ } from '@chakra-ui/react';
import { Box, Container } from 'ui';
import { FC, useEffect, useState } from 'react';
// import { MdEdit } from 'react-icons/md';
import { sort, useProductListList } from 'shared';
import { ProductList } from 'shared/entities/product-list';
import { Heading } from 'ui';
// import { ModalEdit } from './ModalEdit';
import { ProductCardCarousel } from './ProductCardCarousel';
// import { ProductListSectionEdit } from './ProductListSectionEdit';
import { User } from 'shared/entities/user';
import { isBrowser } from 'shared';

const _grey3 = 'brand.grey.3';
const _bg = 'brand.background';

type ProductListSectionProps = { name: string };
// type EditProps = {
//   data: Array<ProductList>;
// };

// const Edit: FC<EditProps> = ({ data }) => {
//   const { isOpen, onOpen, onClose } = useDisclosure();
//   return (
//     <>
//       <IconButton
//         w="3rem"
//         h="3rem"
//         aria-label=""
//         bg="none"
//         color="grey"
//         icon={<MdEdit />}
//         onClick={onOpen}
//         _hover={{ color: 'black' }}
//       />
//       <ModalEdit title="Listas de productos" isOpen={isOpen} scrollBehavior="inside" onOpen={onOpen} onClose={onClose}>
//         <ProductListSectionEdit data={data} />
//       </ModalEdit>
//     </>
//   );
// };

export const ProductListSection: FC<ProductListSectionProps> = ({ name }) => {
  const { isLoading, error, data = [] } = useProductListList();
  const issBrowser = isBrowser();
  const [user, setUser] = useState<User>();
  const isUserAdmin = user?.roles?.includes('admin'); // TODO: improve this

  useEffect(() => {
    if (issBrowser) setUser(lscache.get('user')); // TODO: improve this
  }, [issBrowser]);

  if (error) {
    console.log(error);
    return <></>;
  }

  const dataFilter = data.filter((productList: ProductList) => productList.section === name);
  const dataSort = sort<ProductList>(dataFilter, 'indx');

  return (
    <Box bg={_bg}>
      <Container p="0">
        <Flex direction="column">
          {dataSort.map(({ id, name, product_ids }, i) => (
            <Flex key={i} direction="column" w="100%" p="1rem 1rem 2rem">
              <Heading as="h3" size="xl" color={_grey3}>
                {name} {/* <Edit data={data} /> */}
              </Heading>
              <ProductCardCarousel
                key={i}
                productListId={id}
                editMode={isUserAdmin}
                productsLength={product_ids.length}
              />
            </Flex>
          ))}
        </Flex>
      </Container>
    </Box>
  );
};
