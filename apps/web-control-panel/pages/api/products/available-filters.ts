import type { NextApiRequest, NextApiResponse } from 'next'
import { getAvailableFilters } from '../../../lib/services/product.service'
import { errorResponse, methodNotAllowed } from '../../../lib/errors'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET'])
  try {
    const brandId = req.query.brand_id ? Number(req.query.brand_id) : undefined
    const categoryId = req.query.category_id as string | undefined
    const filters = await getAvailableFilters(brandId, categoryId)
    return res.status(200).json(filters)
  } catch (error) {
    return errorResponse(res, error)
  }
}
