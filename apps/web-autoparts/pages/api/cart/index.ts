import type { NextApiRequest, NextApiResponse } from 'next'
import { getCart, addToCart, updateCartQuantity, deleteFromCart, mergeCarts } from '../../lib/services/cart.service'

function getTokenFromReq(req: NextApiRequest): string | null {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) return null
  return authHeader.slice(7)
}

function getAnonymousId(req: NextApiRequest): string | null {
  return (req.headers['x-anonymous-id'] as string) || null
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const token = getTokenFromReq(req)
    const anonymousId = getAnonymousId(req)

    if (!token && !anonymousId) {
      return res.status(401).json({ error: 'Se requiere autenticación o ID anónimo' })
    }

    switch (req.method) {
      case 'GET': {
        const cart = await getCart(token, anonymousId)
        return res.json(cart)
      }
      case 'POST': {
        const cart = await addToCart(req.body, token, anonymousId)
        return res.json(cart)
      }
      case 'PUT': {
        const cart = await updateCartQuantity(req.body, token, anonymousId)
        return res.json(cart)
      }
      case 'DELETE': {
        const cart = await deleteFromCart(req.body, token, anonymousId)
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
