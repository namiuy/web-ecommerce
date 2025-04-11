import { NextPage } from 'next';
import { NavBar } from '../components';
import { GaPage, OrderHistoryTemplate } from 'ui';

const OrderHistoryPage: NextPage = () => {
  return (
    <GaPage page="MyOrders">
      <>
        <NavBar />
        <OrderHistoryTemplate />
      </>
    </GaPage>
  );
};

export default OrderHistoryPage;
