import { create } from 'zustand';
import { Cart } from '../entities/cart';

type CartState = {
  cart: Cart | null;
  totalPrice: number;
  itemsCount: number;
  isLoading: boolean;
  error: string | null;
  isOpen: boolean;
  setCart: (cart: Cart) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setIsOpen: (isOpen: boolean) => void;
};

export const useCartStore = create<CartState>(set => ({
  cart: null,
  totalPrice: 0,
  itemsCount: 0,
  isLoading: false,
  error: null,
  isOpen: false,

  setCart: async (cart: Cart) => {
    const updatedPrice = cart.items?.reduce((total, item) => total + parseFloat(item.price) * item.quantity, 0);
    const itemsCount = cart.items?.reduce((acc, product) => acc + product.quantity, 0);
    set({ cart, totalPrice: updatedPrice, itemsCount });
  },

  setIsLoading: async (isLoading: boolean) => {
    set({ isLoading });
  },

  setError: async (error: string | null) => {
    set({ error });
  },

  setIsOpen: async (isOpen: boolean) => {
    set({ isOpen });
  },
}));
