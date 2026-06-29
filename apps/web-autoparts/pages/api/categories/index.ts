import type { NextApiRequest, NextApiResponse } from 'next'
import { listCategories } from '../../../lib/services/category.service'
import { config } from '../../../lib/config'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log('[api/categories] autopartsApiBaseUrl:', config.autopartsApiBaseUrl)
    const categories = await listCategories()
    res.json(categories)
  } catch (error: any) {
    console.error('[api/categories] error:', error.message, error.cause)
    res.status(error.status || 500).json({
      error: error.message || 'Internal Server Error',
      autopartsUrl: config.autopartsApiBaseUrl,
    })
  }
}
