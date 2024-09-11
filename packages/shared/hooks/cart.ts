import {
  getCart as apiGetCart,
  addToCart as apiAddToCart,
  updateQuantityCart as apiUpdateQuantity,
  deleteFromCart as apiDeleteFromCart,
} from './request/cart';
import { Cart } from '../entities/cart';
import { useCartStore } from '../store/cart';
import { useToast } from '@chakra-ui/react';

type CartState = {
  cart: Cart | null;
  totalPrice: number;
  itemsCount: number;
  isLoading: boolean;
  error: string | null;
  getCart: () => void;
  addToCart: (code: string, quantity: number) => void;
  updateQuantityCart: (code: string, quantity: number) => void;
  deleteFromCart: (code: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

type CartProps = {
  onError?: (error: string) => void;
};

export const useCart = (props: CartProps): CartState => {
  const {
    cart,
    totalPrice,
    itemsCount,
    isLoading,
    error,
    setCart,
    setIsLoading,
    setError: setErrorStore,
    isOpen,
    setIsOpen,
  } = useCartStore();

  const setError = (newError: string | null) => {
    if (props?.onError && newError) {
      props?.onError(newError);
    }
    setErrorStore(newError);
  };

  const getCart = async () => {
    setIsLoading(true);
    apiGetCart()
      .then(result => {
        if (result) {
          setCart(result);
        }
      })
      .catch((err: any) => {
        setError(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const addToCart = async (code: string, quantity: number) => {
    setIsLoading(true);
    setError(null);
    apiAddToCart({ code, quantity })
      .then(result => {
        if (result) {
          if (result.error) {
            setError(result.error);
            if (result.error === 'Stock Insuficiente') {
              setCart(result);
              setIsOpen(true);
            }
          } else {
            setCart(result);
            setIsOpen(true);
          }
        }
      })
      .catch((err: any) => {
        setError(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const updateQuantityCart = async (code: string, quantity: number) => {
    setIsLoading(true);
    setError(null);
    apiUpdateQuantity({ code, quantity })
      .then(result => {
        if (result) {
          if (result.error) {
            setError(result.error);
          } else {
            setCart(result);
          }
        }
      })
      .catch((err: any) => {
        setError(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const deleteFromCart = async (code: string) => {
    setIsLoading(true);
    apiDeleteFromCart({ code })
      .then(result => {
        if (result) {
          setCart(result);
        }
      })
      .catch((err: any) => {
        setError(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return {
    cart,
    isLoading,
    error,
    totalPrice,
    itemsCount,
    getCart,
    addToCart,
    updateQuantityCart,
    deleteFromCart,
    isOpen,
    setIsOpen,
  };
};
