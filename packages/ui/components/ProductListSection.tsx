import lscache from 'lscache';
import { Flex, IconButton, useDisclosure } from '@chakra-ui/react';
import { FC } from 'react';
import { MdEdit } from 'react-icons/md';
import { sort, useProductListList } from 'shared';
import { ProductList } from 'shared/entities/product-list';
import { Heading } from 'ui';
import { ModalEdit } from './ModalEdit';
import { ProductCardCarousel } from './ProductCardCarousel';
import { ProductListSectionEdit } from './ProductListSectionEdit';
import { User } from 'shared/entities/user';

const _grey3 = 'brand.grey.3';

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
  const user: User = lscache.get('user'); // TODO: improve this
  const isUserAdmin = user?.roles?.includes('admin'); // TODO: improve this

  if (error) {
    console.log(error);
    return <></>;
  }

  if (isLoading) return <></>; // TODO:!

  const dataFilter = data.filter((productList: ProductList) => productList.section === name);
  const dataSort = sort<ProductList>(dataFilter, 'indx');

  return (
    <Flex direction="column" gap="2rem" pt="0.375rem" p={{ base: '0 1rem', xl: 0 }}>
      {dataSort.map(({ id, name, product_ids }, i) => (
        <Flex key={i} direction="column" w="100%" gap="1rem">
          <Heading as="h3" size="xl" color={_grey3}>
            {name} {/* <Edit data={data} /> */}
          </Heading>
          <ProductCardCarousel key={i} productListId={id} editMode={isUserAdmin} productsLength={product_ids.length} />
        </Flex>
      ))}
    </Flex>
  );
};
