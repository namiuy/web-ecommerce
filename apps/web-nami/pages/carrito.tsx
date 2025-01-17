import { NextPage } from 'next';
import { GaPage, ShoppingCartTemplate } from 'ui';
import { NavBar } from '../components';

const ShoppingCartPage: NextPage = () => (
  <GaPage page="Cart">
    <>
      <NavBar />
      <ShoppingCartTemplate />
    </>
  </GaPage>
);

export default ShoppingCartPage;
