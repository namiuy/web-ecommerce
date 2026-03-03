import { IOrderRepository, Order, OrderList, OrderFilters, Checkout, Result } from '@namiuy/bff-core';

// Use case factories (functional approach)
export const createCheckoutUseCase = (repository: IOrderRepository) => {
  return async (checkout: Checkout): Promise<Result<Order>> => {
    return await repository.checkout(checkout);
  };
};

export const createListOrdersUseCase = (repository: IOrderRepository) => {
  return async (filters: OrderFilters, index: number): Promise<Result<OrderList>> => {
    return await repository.listOrders(filters, index);
  };
};

export type CheckoutUseCase = ReturnType<typeof createCheckoutUseCase>;
export type ListOrdersUseCase = ReturnType<typeof createListOrdersUseCase>;
