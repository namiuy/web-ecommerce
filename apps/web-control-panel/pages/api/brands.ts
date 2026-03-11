import type { NextApiRequest, NextApiResponse } from 'next';
import { createRepositories } from './_config';
import { createListBrandsUseCase } from '../../usecases/brand';
import { methodNotAllowed, sendResult } from './_helpers';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow GET method
  if (req.method !== 'GET') {
    return methodNotAllowed(res, ['GET']);
  }

  // Get repositories (no auth needed for brands)
  const { brandRepository } = createRepositories();

  // Create and execute use case
  const listBrands = createListBrandsUseCase(brandRepository);
  const result = await listBrands();

  // Send response
  return sendResult(res, result);
}
