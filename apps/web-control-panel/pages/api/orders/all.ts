import type { NextApiRequest, NextApiResponse } from 'next';
import { OrderFilters } from '@namiuy/bff-core';
import { createRepositories } from '../_config';
import { createListOrdersUseCase } from '../../../usecases/order';
import { requireAuth, sendResult, methodNotAllowed } from '../_helpers';

export default requireAuth(async (req: NextApiRequest, res: NextApiResponse, token: string) => {
  if (req.method !== 'GET') {
    return methodNotAllowed(res, ['GET']);
  }

  // Get repositories with auth
  const { orderRepository } = createRepositories(() => token);

  // List all orders without filters
  const filters: OrderFilters = {};
  const page = 0;

  const listOrders = createListOrdersUseCase(orderRepository);
  const result = await listOrders(filters, page);
  return sendResult(res, result);
});
