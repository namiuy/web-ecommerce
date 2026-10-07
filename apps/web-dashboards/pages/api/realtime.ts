import type { NextApiRequest, NextApiResponse } from 'next';
import { getRealtime } from '../../lib/analytics';

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json(await getRealtime());
}
