import type { NextApiRequest, NextApiResponse } from 'next'
import { listBrands } from '../../../lib/services/brand.service'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const brands = await listBrands()
    res.json(brands)
  } catch (error: any) {
    console.error('[api/brands]', error)
    res.status(error.status || 500).json({ error: error.message || 'Internal Server Error' })
  }
}
