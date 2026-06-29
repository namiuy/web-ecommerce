import type { NextApiRequest, NextApiResponse } from 'next'
import { listCategories } from '../../../lib/services/category.service'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const autopartsUrl = process.env.NEXT_PUBLIC_AUTOPARTS_API_BASE_URL || process.env.AUTOPARTS_API_BASE_URL || 'NOT SET'
    console.log('[api/categories] AUTOPARTS_API_BASE_URL:', autopartsUrl)
    const categories = await listCategories()
    res.json(categories)
  } catch (error: any) {
    console.error('[api/categories] error:', error.message, error.cause)
    res.status(error.status || 500).json({
      error: error.message || 'Internal Server Error',
      autopartsUrl: process.env.NEXT_PUBLIC_AUTOPARTS_API_BASE_URL || process.env.AUTOPARTS_API_BASE_URL || 'NOT SET',
    })
  }
}
