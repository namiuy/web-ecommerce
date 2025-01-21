import { useEffect, useState } from 'react';
import { bff } from '../../env';
import { post, get } from '../../utils/fetcher';
import { Result } from './result';
import { Order } from '../../entities/order';
import { OrderList } from '../../entities/order-list';

const checkout = (order_details: Partial<Order>): Promise<Order> => {
  return post<Order>(`${bff.url}/order`, { body: JSON.stringify(order_details) }, true);
};

const listOrders = (id: string): Promise<OrderList> => {
  return get<OrderList>(`${bff.url}/orders?guid=${id}`, {}, true);
};

export const useCheckout = (order_details?: Partial<Order>): Result<Order> => {
  const [order, setOrder] = useState<Order>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const fetchData = async () => {
      if (order_details) {
        setIsLoading(true);
        const result = await checkout(order_details);

        if (result.error) {
          setError(result.error);
        } else {
          setOrder(result);
        }
        setIsLoading(false);
      }
    };

    fetchData();
  }, [order_details]);

  return { isLoading, data: order, error };
};

export const useListOrders = (id?: string): Result<OrderList> => {
  const [orders, setOrders] = useState<OrderList>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      if (!id) return;
      const result = await listOrders(id);

      if (result.error) {
        setError(result.error);
      } else {
        setOrders(result);
      }
      setIsLoading(false);
    };

    fetchData();
  }, [id]);

  return { isLoading, data: orders, error };
};
