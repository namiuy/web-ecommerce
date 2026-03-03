import type { NextApiRequest, NextApiResponse } from 'next';
import { createRepositories } from '../../_config';
import { createGetRelatedProductsUseCase } from '../../../../usecases/product';
import { methodNotAllowed, sendResult } from '../../_helpers';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow GET method
  if (req.method !== 'GET') {
    return methodNotAllowed(res, ['GET']);
  }

  // Get product ID from query
  const { id } = req.query;
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Product ID is required' });
  }

  // Get repositories
  const { productRepository } = createRepositories();

  // Create and execute use case
  const getRelatedProducts = createGetRelatedProductsUseCase(productRepository);
  const result = await getRelatedProducts(id);

  // Send response
  return sendResult(res, result);
}
