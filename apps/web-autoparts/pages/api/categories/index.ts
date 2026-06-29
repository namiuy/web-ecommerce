import type { NextApiRequest, NextApiResponse } from 'next'
import { listCategories } from '../../../lib/services/category.service'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const categories = await listCategories()
    res.json(categories)
  } catch (error: any) {
    console.error('[api/categories]', error)
    res.status(error.status || 500).json({ error: error.message || 'Internal Server Error' })
  }
}
