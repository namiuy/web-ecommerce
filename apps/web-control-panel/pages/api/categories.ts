import type { NextApiRequest, NextApiResponse } from 'next';
import { createRepositories } from './_config';
import { createListCategoriesUseCase } from '../../usecases/category';
import { methodNotAllowed, sendResult } from './_helpers';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow GET method
  if (req.method !== 'GET') {
    return methodNotAllowed(res, ['GET']);
  }

  // Get repositories (no auth needed for categories)
  const { categoryRepository } = createRepositories();

  // Create and execute use case
  const listCategories = createListCategoriesUseCase(categoryRepository);
  const result = await listCategories();

  // Send response
  return sendResult(res, result);
}
