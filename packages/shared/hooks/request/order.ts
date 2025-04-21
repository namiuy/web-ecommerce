import { useEffect, useState } from 'react';
import { bff } from '../../env';
import { post, get } from '../../utils/fetcher';
import { Result } from './result';
import { Order } from '../../entities/order';
import { OrderList } from '../../entities/order_list';
import { Checkout } from '../../entities/checkout';
import { StatusChange } from '../../entities/status-change';

const checkout = (checkout: Checkout): Promise<Order> => {
  return post<Order>(`${bff.url}/order`, { body: JSON.stringify(checkout) }, true);
};

const listOrders = (id: string): Promise<OrderList> => {
  return get<OrderList>(`${bff.url}/orders?guid=${id}`, {}, true);
};

export const useCheckout = (checkout_values?: Checkout): Result<Order> => {
  const [order, setOrder] = useState<Order>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const fetchData = async () => {
      if (checkout_values) {
        setIsLoading(true);
        const result = await checkout(checkout_values);

        if (result.error) {
          setError(result.error);
        } else {
          setOrder(result);
        }
        setIsLoading(false);
      }
    };

    fetchData();
  }, [checkout_values]);

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

export const statusChange = (status_change: StatusChange): Promise<Result<boolean>> => {
  return post<Result<boolean>>(`${bff.url}/order/status-change`, { body: JSON.stringify(status_change) }, true);
};

export const useStatusChange = (props?: StatusChange): Result<boolean> => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<boolean | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (props) {
      const fetchData = async () => {
        setIsLoading(true);
        const result = await statusChange(props);

        if (result.error) {
          setError(result.error);
          setData(undefined);
        } else {
          setData(true);
          setError(undefined);
        }
        setIsLoading(false);
      };
      fetchData();
    }

    return () => {
      setData(undefined);
      setError(undefined);
    };
  }, [props]);

  return { isLoading, data, error };
};
