import type { NextApiRequest, NextApiResponse } from 'next';
import { CartItem } from '@namiuy/bff-core';
import { createRepositories } from './_config';
import {
  createGetCartUseCase,
  createAddToCartUseCase,
  createUpdateCartUseCase,
  createDeleteFromCartUseCase,
} from '../../usecases/cart';
import { requireAuth, sendResult, methodNotAllowed } from './_helpers';

export default requireAuth(async (req: NextApiRequest, res: NextApiResponse, token: string) => {
  // Get repositories with auth
  const { cartRepository } = createRepositories(() => token);

  switch (req.method) {
    case 'GET': {
      // Get cart
      const getCart = createGetCartUseCase(cartRepository);
      const result = await getCart();
      return sendResult(res, result);
    }

    case 'POST': {
      // Add item to cart
      const item: Partial<CartItem> = req.body;
      const addToCart = createAddToCartUseCase(cartRepository);
      const result = await addToCart(item);
      return sendResult(res, result);
    }

    case 'PUT': {
      // Update cart item quantity
      const item: Partial<CartItem> = req.body;
      const updateCart = createUpdateCartUseCase(cartRepository);
      const result = await updateCart(item);
      return sendResult(res, result);
    }

    case 'DELETE': {
      // Remove item from cart
      const item: Partial<CartItem> = req.body;
      const deleteFromCart = createDeleteFromCartUseCase(cartRepository);
      const result = await deleteFromCart(item);
      return sendResult(res, result);
    }

    default:
      return methodNotAllowed(res, ['GET', 'POST', 'PUT', 'DELETE']);
  }
});
