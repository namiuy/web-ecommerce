import type { NextApiRequest, NextApiResponse } from 'next';
import { createRepositories } from './_config';
import { createListBannersUseCase } from '../../usecases/banner';
import { methodNotAllowed, sendResult } from './_helpers';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow GET method
  if (req.method !== 'GET') {
    return methodNotAllowed(res, ['GET']);
  }

  // Get repositories (no auth needed for banners)
  const { bannerRepository } = createRepositories();

  // Create and execute use case
  const listBanners = createListBannersUseCase(bannerRepository);
  const result = await listBanners();

  // Send response
  return sendResult(res, result);
}
