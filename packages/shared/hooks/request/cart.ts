import { Cart } from '../../entities/cart';
import { CartItem } from '../../entities/cart-item';
import { bff } from '../../env';
import { get, del, post, put } from '../../utils/fetcher';

export const addToCart = (item: Partial<CartItem>): Promise<Cart> => {
  return post<Cart>(`${bff.url}/cart`, { body: JSON.stringify(item) }, true);
};

export const updateQuantityCart = (item: Partial<CartItem>): Promise<Cart> => {
  return put<Cart>(`${bff.url}/cart`, { body: JSON.stringify(item) }, true);
};

export const deleteFromCart = (item: Partial<CartItem>): Promise<Cart> => {
  return del<Cart>(`${bff.url}/cart`, { body: JSON.stringify(item) }, true);
};

export const getCart = (): Promise<Cart> => {
  return get<Cart>(`${bff.url}/cart`, {}, true);
};
