import type { NextApiRequest, NextApiResponse } from 'next';
import { createRepositories } from './_config';
import { createListCitiesUseCase } from '../../usecases/city';
import { methodNotAllowed, sendResult } from './_helpers';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow GET method
  if (req.method !== 'GET') {
    return methodNotAllowed(res, ['GET']);
  }

  // Get repositories (no auth needed for cities)
  const { cityRepository } = createRepositories();

  // Create and execute use case
  const listCities = createListCitiesUseCase(cityRepository);
  const result = await listCities();

  // Send response
  return sendResult(res, result);
}
