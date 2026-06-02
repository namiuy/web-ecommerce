import type { NextApiRequest, NextApiResponse } from 'next'
import { listBanners } from '../../lib/services/banner.service'
import { errorResponse, methodNotAllowed } from '../../lib/errors'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET'])
  try {
    const banners = await listBanners()
    return res.status(200).json(banners)
  } catch (error) {
    return errorResponse(res, error)
  }
}
