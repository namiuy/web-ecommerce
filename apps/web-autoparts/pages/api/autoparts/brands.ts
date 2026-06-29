import type { NextApiRequest, NextApiResponse } from 'next'
import { getBrandsByProductType } from '../../../lib/services/autopart.service'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const productType = (req.query.productType as string) || ''
    const brands = await getBrandsByProductType(productType)
    res.json(brands)
  } catch (error: any) {
    console.error('[api/autoparts/brands]', error)
    res.status(error.status || 500).json({ error: error.message || 'Internal Server Error' })
  }
}
