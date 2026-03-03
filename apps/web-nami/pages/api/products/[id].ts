import type { NextApiRequest, NextApiResponse } from 'next';
import { createRepositories } from '../_config';
import { createGetProductUseCase } from '../../../usecases/product';
import { methodNotAllowed, sendResult, optionalAuth } from '../_helpers';

export default optionalAuth(async (req: NextApiRequest, res: NextApiResponse, token: string | null) => {
  // Only allow GET method
  if (req.method !== 'GET') {
    return methodNotAllowed(res, ['GET']);
  }

  // Get product ID from query
  const { id } = req.query;
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Product ID is required' });
  }

  // Get repositories with optional auth
  const { productRepository } = createRepositories(token ? () => token : undefined);

  // Create and execute use case
  const getProduct = createGetProductUseCase(productRepository);
  const result = await getProduct(id);

  // Send response
  return sendResult(res, result);
});
