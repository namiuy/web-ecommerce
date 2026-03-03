import type { NextApiRequest, NextApiResponse } from 'next';
import { methodNotAllowed } from './_helpers';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow GET method
  if (req.method !== 'GET') {
    return methodNotAllowed(res, ['GET']);
  }

  // Return empty array for now (feature not implemented)
  return res.status(200).json([]);
}
