import type { NextApiRequest, NextApiResponse } from 'next'
import { getCart, addToCart, updateCartQuantity, deleteFromCart } from '../../lib/services/cart.service'

function getTokenFromReq(req: NextApiRequest): string {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    throw Object.assign(new Error('Unauthorized'), { status: 401 })
  }
  return authHeader.slice(7)
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const token = getTokenFromReq(req)

    switch (req.method) {
      case 'GET': {
        const cart = await getCart(token)
        return res.json(cart)
      }
      case 'POST': {
        const cart = await addToCart(req.body, token)
        return res.json(cart)
      }
      case 'PUT': {
        const cart = await updateCartQuantity(req.body, token)
        return res.json(cart)
      }
      case 'DELETE': {
        const cart = await deleteFromCart(req.body, token)
        return res.json(cart)
      }
      default:
        return res.status(405).json({ error: 'Method not allowed' })
    }
  } catch (error: any) {
    console.error('[api/cart]', error)
    res.status(error.status || 500).json({ error: error.message || 'Internal Server Error' })
  }
}
