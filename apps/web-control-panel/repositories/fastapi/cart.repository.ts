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

// FastAPI types (PascalCase from backend)
type FastAPICartItem = {
  Code: string;
  ItemsName: string;
  ItemsPrice: string;
  ItemsQuantity: number;
  ItemsMediaName?: string;
};

type FastAPICart = {
  CartId: number;
  CartState: string;
  CartUserGUID: string;
  items: FastAPICartItem[];
};

// Mapper function (pure)
const mapCart = (imagesUrl: string) => (cart: FastAPICart): Cart => ({
  id: cart.CartId.toString(),
  person_id: cart.CartUserGUID,
  state: cart.CartState,
  items: cart.items.map(item => ({
    code: item.Code,
    name: item.ItemsName,
    image_url: `${imagesUrl}/${item.Code}.jpg`,
    price: item.ItemsPrice,
    quantity: item.ItemsQuantity,
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

        const data = await response.json();
        const apiCart = data.cart as FastAPICart;
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

        const data = await response.json();
        const apiCart = data.cart as FastAPICart;
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

        const data = await response.json();
        const apiCart = data.cart as FastAPICart;
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

        const data = await response.json();
        const apiCart = data.cart as FastAPICart;
        return createSuccessResult(mapper(apiCart));
      } catch (error) {
        return createErrorResult(createUnhandledError((error as Error).message));
      }
    },
  };
};
