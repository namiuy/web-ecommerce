import type { NextApiRequest, NextApiResponse } from 'next'
import { searchByPartialCode } from '../../../lib/services/product.service'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const code = (req.query.q as string) || ''
    if (!code || code.length < 3) {
      return res.json({ products: [] })
    }

    const results = await searchByPartialCode(code.trim())
    const products = results?.productos || results || []
    res.json({ products: Array.isArray(products) ? products : [] })
  } catch (error: any) {
    console.error('[api/products/code]', error.message)
    // Return empty results on 404 (no products found)
    if (error.status === 404) {
      return res.json({ products: [] })
    }
    res.status(error.status || 500).json({ error: error.message || 'Internal Server Error' })
  }
}
