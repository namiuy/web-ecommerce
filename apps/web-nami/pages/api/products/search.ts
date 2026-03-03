import type { NextApiRequest, NextApiResponse } from 'next';
import { SearchFilters, ProductSearchSortBy } from '@namiuy/bff-core';
import { createRepositories } from '../_config';
import { createSearchProductsUseCase } from '../../../usecases/product';
import { methodNotAllowed, sendResult, optionalAuth } from '../_helpers';

export default optionalAuth(async (req: NextApiRequest, res: NextApiResponse, token: string | null) => {
  // Only allow GET method
  if (req.method !== 'GET') {
    return methodNotAllowed(res, ['GET']);
  }

  // Parse query parameters
  const { b: brand, c: category, t: words, sortBy = 'rel', index = '0' } = req.query;

  const filters: SearchFilters = {};
  if (brand && typeof brand === 'string') filters.brand = parseInt(brand);
  if (category && typeof category === 'string') filters.category = category;
  if (words && typeof words === 'string') filters.words = words.split(',');

  const sort = sortBy as ProductSearchSortBy;
  const page = parseInt(index as string);

  // Get repositories with optional auth
  const { productRepository } = createRepositories(token ? () => token : undefined);

  // Create and execute use case
  const searchProducts = createSearchProductsUseCase(productRepository);
  const result = await searchProducts(filters, sort, page);

  // Send response
  return sendResult(res, result);
});
