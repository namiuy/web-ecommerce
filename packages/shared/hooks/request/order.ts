import { useEffect, useState } from 'react';
import { post, get } from '../../utils/fetcher';
import { Result } from './result';
import { Order } from '../../entities/order';
import { OrderList } from '../../entities/order_list';
import { Checkout } from '../../entities/checkout';
import { StatusChange } from '../../entities/status-change';

// Use Next.js BFF instead of calling backend directly
const checkout = (checkout: Checkout): Promise<Order> => {
  return post<Order>(`/api/orders`, { body: JSON.stringify(checkout) }, true);
};

const listOrders = (id: string): Promise<OrderList> => {
  return get<OrderList>(`/api/orders?guid=${id}`, {}, true);
};

const listAllOrders = (): Promise<OrderList> => {
  return get<OrderList>(`/api/orders/all`, {}, true);
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

      console.log('[useListOrders] Result:', result);

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

export const useListAllOrders = (): Result<OrderList> => {
  const [orders, setOrders] = useState<OrderList>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const result = await listAllOrders();
      if (result.error) {
        setError(result.error);
      } else {
        setOrders(result);
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);

  return { isLoading, data: orders, error };
};

export const statusChange = (status_change: StatusChange): Promise<Result<boolean>> => {
  return post<Result<boolean>>(`${API_BASE_URL}/api/order/status-change`, { body: JSON.stringify(status_change) }, true);
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
