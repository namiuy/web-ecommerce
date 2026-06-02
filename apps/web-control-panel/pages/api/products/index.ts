import type { NextApiRequest, NextApiResponse } from 'next'
import { requireToken } from '../../../lib/auth'
import { addProduct } from '../../../lib/services/product.service'
import { errorResponse, methodNotAllowed } from '../../../lib/errors'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST'])
  try {
    const token = requireToken(req)
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
    const result = await addProduct(body, token)
    return res.status(200).json(result)
  } catch (error) {
    return errorResponse(res, error)
  }
}
