import {
  IOrderRepository,
  Order,
  OrderList,
  OrderFilters,
  Checkout,
  Status,
  Result,
  createSuccessResult,
  createErrorResult,
  createUnhandledError,
} from '@namiuy/bff-core';

// FastAPI types
type FastAPIOrderItem = {
  code: string;
  items_name: string;
  items_price: string;
  items_quantity: number;
};

type FastAPIOrder = {
  order_id: number;
  order_number: string;
  order_date: string;
  order_guid: string;
  order_user_email: string;
  order_person_name: string;
  order_phone: string;
  order_address: string;
  order_payment_id: string;
  order_shipping_id: string;
  order_state: 'INI' | 'PCH' | 'PPE' | 'PAP' | 'DIS' | 'CAN';
  items?: FastAPIOrderItem[];
};

type FastAPIResponse<T> = {
  success: boolean;
  count: number;
  data: T;
};

// Mapper functions (pure)
const mapStatus = (status: string): Status => {
  switch (status) {
    case 'INI':
      return Status.PENDING_PAYMENT;
    case 'PCH':
      return Status.INCOMPLETE_PAYMENT;
    case 'PPE':
      return Status.PROCESSING_PAYMENT;
    case 'PAP':
      return Status.APPROVED_PAYMENT;
    case 'DIS':
      return Status.DISPATCHED;
    case 'CAN':
      return Status.CANCELED;
    default:
      return Status.PENDING_PAYMENT;
  }
};

const mapOrder = (imagesUrl: string) => (order: FastAPIOrder): Order => ({
  id: order.order_id.toString(),
  number: order.order_number,
  user_mail: order.order_user_email,
  date: order.order_date,
  person: {
    id: '',
    name: order.order_person_name?.split(' ')[0] || '',
    last_name: order.order_person_name?.split(' ').slice(1).join(' ') || '',
  },
  phone: order.order_phone,
  address: {
    address: order.order_address,
    city_id: '',
    city_name: '',
    state_id: '',
    state_name: '',
    postal_code: '',
  },
  payment: {
    id: order.order_payment_id,
    name: '',
  },
  shipping: {
    id: order.order_shipping_id,
    name: '',
  },
  status: mapStatus(order.order_state),
  items: order.items?.map(item => ({
    code: item.code,
    name: item.items_name,
    image_url: `${imagesUrl}/${item.code}.jpg`,
    price: item.items_price,
    quantity: item.items_quantity,
  })) || [],
});

// Repository factory (functional approach)
export const createOrderRepositoryFastAPI = (
  apiBaseUrl: string,
  imagesUrl: string,
  getAuthToken?: () => string | null
): IOrderRepository => {
  const mapper = mapOrder(imagesUrl);

  const getHeaders = (): HeadersInit => {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (getAuthToken) {
      const token = getAuthToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return headers;
  };

  return {
    checkout: async (checkout: Checkout): Promise<Result<Order>> => {
      try {
        const body = {
          shippingId: checkout.shipping_id,
          paymentId: checkout.payment_id,
          addressIdx: checkout.address_indx,
          observation: checkout.observation,
        };

        const response = await fetch(`${apiBaseUrl}/cart/checkout`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          const errorText = await response.text();
          return createErrorResult(createUnhandledError(errorText));
        }

        const apiOrder = (await response.json()) as FastAPIOrder;
        return createSuccessResult(mapper(apiOrder));
      } catch (error) {
        return createErrorResult(createUnhandledError((error as Error).message));
      }
    },

    listOrders: async (filters: OrderFilters, index: number): Promise<Result<OrderList>> => {
      try {
        const params = new URLSearchParams();
        if (filters.guid) params.append('guid', filters.guid);
        if (filters.companyId) params.append('company_id', filters.companyId);

        const endpoint = filters.guid
          ? `${apiBaseUrl}/orders/filter?${params.toString()}`
          : `${apiBaseUrl}/orders/user/me`;

        const response = await fetch(endpoint, {
          method: 'GET',
          headers: getHeaders(),
        });

        if (!response.ok) {
          const errorText = await response.text();
          return createErrorResult(createUnhandledError(errorText));
        }

        const apiResponse = (await response.json()) as FastAPIResponse<Array<FastAPIOrder>>;
        const orders = apiResponse.data.map(mapper);

        return createSuccessResult({
          orders,
          result_count: apiResponse.count,
        });
      } catch (error) {
        return createErrorResult(createUnhandledError((error as Error).message));
      }
    },
  };
};
