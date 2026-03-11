import { ICartRepository, Cart, CartItem, Result } from '@namiuy/bff-core';

// Use case factories (functional approach)
export const createGetCartUseCase = (repository: ICartRepository) => {
  return async (): Promise<Result<Cart>> => {
    return await repository.get();
  };
};

export const createAddToCartUseCase = (repository: ICartRepository) => {
  return async (item: Partial<CartItem>): Promise<Result<Cart>> => {
    return await repository.add(item);
  };
};

export const createUpdateCartUseCase = (repository: ICartRepository) => {
  return async (item: Partial<CartItem>): Promise<Result<Cart>> => {
    return await repository.update(item);
  };
};

export const createDeleteFromCartUseCase = (repository: ICartRepository) => {
  return async (item: Partial<CartItem>): Promise<Result<Cart>> => {
    return await repository.delete(item);
  };
};

export type GetCartUseCase = ReturnType<typeof createGetCartUseCase>;
export type AddToCartUseCase = ReturnType<typeof createAddToCartUseCase>;
export type UpdateCartUseCase = ReturnType<typeof createUpdateCartUseCase>;
export type DeleteFromCartUseCase = ReturnType<typeof createDeleteFromCartUseCase>;
