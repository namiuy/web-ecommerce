import type { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from '../../../lib/auth'
import { searchProducts } from '../../../lib/services/product.service'
import { errorResponse, methodNotAllowed } from '../../../lib/errors'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET'])
  try {
    const token = getToken(req)
    const { b: brand, c: category, t: words, sortBy = 'rel', index = '0' } = req.query

    const filters: { brand?: number; category?: string; words?: string[] } = {}
    if (brand && typeof brand === 'string') filters.brand = parseInt(brand)
    if (category && typeof category === 'string') filters.category = category
    if (words && typeof words === 'string') filters.words = words.split(',')

    const result = await searchProducts(filters, sortBy as string, parseInt(index as string), token)
    return res.status(200).json(result)
  } catch (error) {
    return errorResponse(res, error)
  }
}
