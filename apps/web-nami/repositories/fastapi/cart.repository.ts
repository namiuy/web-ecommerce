import {
  ICartRepository,
  Cart,
  CartItem,
  Result,
  createSuccessResult,
  createErrorResult,
  createUnhandledError,
  UNAUTHORIZED,
} from '@namiuy/bff-core';

// FastAPI types
type FastAPICartItem = {
  code: string;
  items_name: string;
  items_price: string;
  items_quantity: number;
  items_media_name?: string;
};

type FastAPICart = {
  cart_id: number;
  cart_state: string;
  cart_user_guid: string;
  items: FastAPICartItem[];
};

// Mapper function (pure)
const mapCart = (imagesUrl: string) => (cart: FastAPICart): Cart => ({
  id: cart.cart_id.toString(),
  person_id: cart.cart_user_guid,
  state: cart.cart_state,
  items: cart.items.map(item => ({
    code: item.code,
    name: item.items_name,
    image_url: `${imagesUrl}/${item.code}.jpg`,
    price: item.items_price,
    quantity: item.items_quantity,
  })),
});

// Repository factory (functional approach)
export const createCartRepositoryFastAPI = (
  apiBaseUrl: string,
  imagesUrl: string,
  getAuthToken?: () => string | null
): ICartRepository => {
  const mapper = mapCart(imagesUrl);

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
    get: async (): Promise<Result<Cart>> => {
      try {
        const response = await fetch(`${apiBaseUrl}/cart/get`, {
          method: 'GET',
          headers: getHeaders(),
        });

        if (!response.ok) {
          if (response.status === 401) {
            return createErrorResult(UNAUTHORIZED);
          }
          const errorText = await response.text();
          return createErrorResult(createUnhandledError(errorText));
        }

        const apiCart = (await response.json()) as FastAPICart;
        return createSuccessResult(mapper(apiCart));
      } catch (error) {
        return createErrorResult(createUnhandledError((error as Error).message));
      }
    },

    add: async (item: Partial<CartItem>): Promise<Result<Cart>> => {
      try {
        const body = {
          code: item.code,
          quantity: item.quantity || 1,
        };

        const response = await fetch(`${apiBaseUrl}/cart/add`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          const errorText = await response.text();
          return createErrorResult(createUnhandledError(errorText));
        }

        const apiCart = (await response.json()) as FastAPICart;
        return createSuccessResult(mapper(apiCart));
      } catch (error) {
        return createErrorResult(createUnhandledError((error as Error).message));
      }
    },

    update: async (item: Partial<CartItem>): Promise<Result<Cart>> => {
      try {
        const body = {
          code: item.code,
          quantity: item.quantity,
        };

        const response = await fetch(`${apiBaseUrl}/cart/updateQuantity`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          const errorText = await response.text();
          return createErrorResult(createUnhandledError(errorText));
        }

        const apiCart = (await response.json()) as FastAPICart;
        return createSuccessResult(mapper(apiCart));
      } catch (error) {
        return createErrorResult(createUnhandledError((error as Error).message));
      }
    },

    delete: async (item: Partial<CartItem>): Promise<Result<Cart>> => {
      try {
        const body = {
          code: item.code,
        };

        const response = await fetch(`${apiBaseUrl}/cart/deleteItem`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          const errorText = await response.text();
          return createErrorResult(createUnhandledError(errorText));
        }

        const apiCart = (await response.json()) as FastAPICart;
        return createSuccessResult(mapper(apiCart));
      } catch (error) {
        return createErrorResult(createUnhandledError((error as Error).message));
      }
    },
  };
};
