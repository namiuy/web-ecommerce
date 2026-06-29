import type { NextApiRequest, NextApiResponse } from 'next'
import { searchBySelection } from '../../../lib/services/autopart.service'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const productType = (req.query.productType as string) || ''
    const brand = (req.query.brand as string) || ''
    const model = (req.query.model as string) || ''
    const results = await searchBySelection(productType, brand, model)
    res.json(results)
  } catch (error: any) {
    console.error('[api/autoparts/search]', error)
    res.status(error.status || 500).json({ error: error.message || 'Internal Server Error' })
  }
}
