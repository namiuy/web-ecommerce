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

// FastAPI types (backend returns PascalCase)
type FastAPIOrderItem = {
  Code: string;
  ItemsName: string;
  ItemsPrice: string;
  ItemsQuantity: number;
};

type FastAPIOrder = {
  OrderId: number;
  OrderGUID: string;
  OrderDate: string;
  OrderUserEmail: string;
  OrderPersonName: string;
  OrderPersonLastName: string;
  OrderPhone: string;
  OrderAddress: string;
  OrderAddressCityName: string;
  OrderAddressStateName: string;
  OrderPaymentId: string;
  OrderPaymentName: string;
  OrderShippingId: string;
  OrderShippingName: string;
  OrderState: 'INI' | 'PCH' | 'PPE' | 'PAP' | 'DIS' | 'CAN';
  Items?: FastAPIOrderItem[];
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
  id: order.OrderId.toString(),
  number: order.OrderGUID.trim(),
  user_mail: order.OrderUserEmail,
  date: order.OrderDate,
  person: {
    id: '',
    name: order.OrderPersonName?.trim() || '',
    last_name: order.OrderPersonLastName?.trim() || '',
  },
  phone: order.OrderPhone?.trim() || '',
  address: {
    address: order.OrderAddress?.trim() || '',
    city_id: '',
    city_name: order.OrderAddressCityName?.trim() || '',
    state_id: '',
    state_name: order.OrderAddressStateName?.trim() || '',
    postal_code: '',
  },
  payment: {
    id: order.OrderPaymentId?.trim() || '',
    name: order.OrderPaymentName?.trim() || '',
  },
  shipping: {
    id: order.OrderShippingId?.trim() || '',
    name: order.OrderShippingName?.trim() || '',
  },
  status: mapStatus(order.OrderState),
  items: order.Items?.map((item: FastAPIOrderItem) => ({
    code: item.Code,
    name: item.ItemsName?.trim() || '',
    image_url: `${imagesUrl}/${item.Code}.jpg`,
    price: item.ItemsPrice,
    quantity: item.ItemsQuantity,
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
          shippingId: checkout.shippingId,
          paymentId: checkout.paymentId,
          addressIdx: checkout.addressIdx,
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

        const apiResponse = await response.json();
        // Backend returns {success, message, order, orderId, orderGuid}
        const apiOrder = apiResponse.order as FastAPIOrder;
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
          ? `${apiBaseUrl}/orders?${params.toString()}`
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
