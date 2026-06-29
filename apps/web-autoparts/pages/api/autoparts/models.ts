import type { NextApiRequest, NextApiResponse } from 'next'
import { getModelsByBrandAndProductType } from '../../../lib/services/autopart.service'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const productType = (req.query.productType as string) || ''
    const brand = (req.query.brand as string) || ''
    const models = await getModelsByBrandAndProductType(productType, brand)
    res.json(models)
  } catch (error: any) {
    console.error('[api/autoparts/models]', error)
    res.status(error.status || 500).json({ error: error.message || 'Internal Server Error' })
  }
}
