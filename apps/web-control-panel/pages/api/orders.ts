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
      const checkoutData: Checkout = req.body;
      const checkout = createCheckoutUseCase(orderRepository);
      const result = await checkout(checkoutData);
      return sendResult(res, result);
    }

    default:
      return methodNotAllowed(res, ['GET', 'POST']);
  }
});
