import type { NextApiRequest, NextApiResponse } from 'next'
import { listBrands } from '../../lib/services/brand.service'
import { errorResponse, methodNotAllowed } from '../../lib/errors'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET'])
  try {
    const brands = await listBrands()
    return res.status(200).json(brands)
  } catch (error) {
    return errorResponse(res, error)
  }
}
