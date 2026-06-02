import type { NextApiRequest, NextApiResponse } from 'next'
import { getToken, requireToken } from '../../../lib/auth'
import { getProduct, updateProduct, deleteProduct } from '../../../lib/services/product.service'
import { errorResponse, methodNotAllowed } from '../../../lib/errors'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query
    if (!id || typeof id !== 'string') return res.status(400).json({ error: 'Product ID is required' })

    switch (req.method) {
      case 'GET': {
        const token = getToken(req)
        const product = await getProduct(id, token)
        return res.status(200).json(product)
      }
      case 'PUT': {
        const token = requireToken(req)
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
        const result = await updateProduct(id, body, token)
        return res.status(200).json(result)
      }
      case 'DELETE': {
        const token = requireToken(req)
        await deleteProduct(id, token)
        return res.status(200).json({ success: true })
      }
      default:
        return methodNotAllowed(res, ['GET', 'PUT', 'DELETE'])
    }
  } catch (error) {
    return errorResponse(res, error)
  }
}
