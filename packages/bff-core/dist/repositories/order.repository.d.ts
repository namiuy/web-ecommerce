import { Result } from '../types';
import { Checkout, Order, OrderFilters, OrderList } from '../entities';
export type IOrderRepository = {
    checkout: (checkout: Checkout) => Promise<Result<Order>>;
    listOrders: (filters: OrderFilters, index: number) => Promise<Result<OrderList>>;
};
//# sourceMappingURL=order.repository.d.ts.map