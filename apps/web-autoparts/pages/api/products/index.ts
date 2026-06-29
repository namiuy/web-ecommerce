import type { NextApiRequest, NextApiResponse } from 'next'
import { searchProducts } from '../../../lib/services/product.service'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  try {
    const body = req.body
    const results = await searchProducts(body.query || body.keywords?.join(' ') || '', body.limit || 50)
    res.json(results)
  } catch (error: any) {
    console.error('[api/products]', error)
    res.status(error.status || 500).json({ error: error.message || 'Internal Server Error' })
  }
}
