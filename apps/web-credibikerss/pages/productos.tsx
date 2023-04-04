import { NextPage } from 'next';
import { Container, Head, ProductSearch } from 'ui';
import { NavBar } from '../components';

type ProductsPageProps = {
  brandId?: number;
  categoryId?: string;
  text?: string;
};

const ProductsPage: NextPage<ProductsPageProps> = props => {
  return (
    <>
      <Head />
      <NavBar />
      <Container>
        <ProductSearch {...props} />
      </Container>
    </>
  );
};

ProductsPage.getInitialProps = async ({ query }) => {
  const { b, c, t } = query;
  return {
    brandId: typeof b === 'string' ? Number(b) : undefined,
    categoryId: c?.toString(),
    text: t?.toString(),
  };
};

export default ProductsPage;
