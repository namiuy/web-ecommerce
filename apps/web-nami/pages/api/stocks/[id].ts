import type { NextApiRequest, NextApiResponse } from 'next';
import { createRepositories } from '../_config';
import { createGetStockByProductCodeUseCase } from '../../../usecases/stock';
import { methodNotAllowed, sendResult } from '../_helpers';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow GET method
  if (req.method !== 'GET') {
    return methodNotAllowed(res, ['GET']);
  }

  // Get product ID (code) from query
  const { id, server } = req.query;
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Product code is required' });
  }

  // Get repositories
  const { stockRepository } = createRepositories();

  // Create and execute use case
  const getStockByProductCode = createGetStockByProductCodeUseCase(stockRepository);
  const result = await getStockByProductCode(id, server as string | undefined);

  // Send response
  return sendResult(res, result);
}
