import type { NextApiRequest, NextApiResponse } from 'next'
import { getProductTypes } from '../../../lib/services/autopart.service'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const types = await getProductTypes()
    res.json(types)
  } catch (error: any) {
    console.error('[api/autoparts/product-types]', error)
    res.status(error.status || 500).json({ error: error.message || 'Internal Server Error' })
  }
}
