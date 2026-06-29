import type { NextApiRequest, NextApiResponse } from 'next'
import { searchByPartialCode } from '../../../../lib/services/product.service'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Product ID is required' })
    }
    const results = await searchByPartialCode(id)
    res.json({ autoparts: results })
  } catch (error: any) {
    console.error('[api/products/related/[id]]', error)
    res.status(error.status || 500).json({ error: error.message || 'Internal Server Error' })
  }
}
