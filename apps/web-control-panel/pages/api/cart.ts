import type { NextApiRequest, NextApiResponse } from 'next'
import { requireToken } from '../../lib/auth'
import { getCart, addToCart, updateCartQuantity, deleteFromCart } from '../../lib/services/cart.service'
import { errorResponse, methodNotAllowed } from '../../lib/errors'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const token = requireToken(req)
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body

    switch (req.method) {
      case 'GET': {
        const result = await getCart(token)
        return res.status(200).json(result)
      }
      case 'POST': {
        const result = await addToCart(body.code, body.quantity, token)
        return res.status(200).json(result)
      }
      case 'PUT': {
        const result = await updateCartQuantity(body.code, body.quantity, token)
        return res.status(200).json(result)
      }
      case 'DELETE': {
        const result = await deleteFromCart(body.code, token)
        return res.status(200).json(result)
      }
      default:
        return methodNotAllowed(res, ['GET', 'POST', 'PUT', 'DELETE'])
    }
  } catch (error) {
    return errorResponse(res, error)
  }
}
