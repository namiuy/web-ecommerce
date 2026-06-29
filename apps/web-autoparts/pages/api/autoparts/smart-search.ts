import type { NextApiRequest, NextApiResponse } from 'next'
import { smartSearch } from '../../../lib/services/autopart.service'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  try {
    const { query, limit } = req.body
    const results = await smartSearch(query || '', limit || 50)
    res.json(results)
  } catch (error: any) {
    console.error('[api/autoparts/smart-search]', error)
    res.status(error.status || 500).json({ error: error.message || 'Internal Server Error' })
  }
}
