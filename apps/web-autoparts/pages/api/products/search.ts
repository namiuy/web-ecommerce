import type { NextApiRequest, NextApiResponse } from 'next'
import { searchProducts } from '../../../lib/services/product.service'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const text = (req.query.t as string) || ''
    const query = text.trim()

    if (!query) {
      return res.json({ products: [], filters: {} })
    }

    const results = await searchProducts(query, 50)
    res.json({ products: results, filters: {} })
  } catch (error: any) {
    console.error('[api/products/search]', error)
    res.status(error.status || 500).json({ error: error.message || 'Internal Server Error' })
  }
}
