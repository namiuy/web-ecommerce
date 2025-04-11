import { NextPage } from 'next';
import { CheckoutTemplate, GaPage } from 'ui';
import { NavBar } from '../components';

const CheckoutPage: NextPage = () => (
  <GaPage page="Checkout">
    <>
      <NavBar />
      <CheckoutTemplate />
    </>
  </GaPage>
);

export default CheckoutPage;
