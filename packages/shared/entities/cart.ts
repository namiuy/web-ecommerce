import { CartItem } from './cart-item';

export type Cart = {
  id: string;
  person_id: string;
  items: CartItem[];
  state: string;
  error?: string;
};
