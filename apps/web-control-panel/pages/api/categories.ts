import type { NextApiRequest, NextApiResponse } from 'next'
import { listCategories } from '../../lib/services/category.service'
import { errorResponse, methodNotAllowed } from '../../lib/errors'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET'])
  try {
    const categories = await listCategories()
    return res.status(200).json(categories)
  } catch (error) {
    return errorResponse(res, error)
  }
}
