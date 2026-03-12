import type { NextApiRequest, NextApiResponse } from 'next';
import { Checkout, OrderFilters } from '@namiuy/bff-core';
import { createRepositories } from './_config';
import { createCheckoutUseCase, createListOrdersUseCase } from '../../usecases/order';
import { requireAuth, sendResult, methodNotAllowed } from './_helpers';

export default requireAuth(async (req: NextApiRequest, res: NextApiResponse, token: string) => {
  // Get repositories with auth
  const { orderRepository } = createRepositories(() => token);

  switch (req.method) {
    case 'GET': {
      // List orders
      const { guid, companyId, index = '0' } = req.query;

      const filters: OrderFilters = {};
      if (guid && typeof guid === 'string') filters.guid = guid;
      if (companyId && typeof companyId === 'string') filters.companyId = companyId;

      const page = parseInt(index as string);

      const listOrders = createListOrdersUseCase(orderRepository);
      const result = await listOrders(filters, page);
      return sendResult(res, result);
    }

    case 'POST': {
      // Checkout (create order)
      try {
        console.log('[API /orders POST] Received checkout data:', req.body);
        const checkoutData: Checkout = req.body;
        const checkout = createCheckoutUseCase(orderRepository);
        const result = await checkout(checkoutData);
        console.log('[API /orders POST] Checkout result:', result);
        return sendResult(res, result);
      } catch (error) {
        console.error('[API /orders POST] Error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Internal server error';
        return res.status(500).json({ error: errorMessage });
      }
    }

    default:
      return methodNotAllowed(res, ['GET', 'POST']);
  }
});
