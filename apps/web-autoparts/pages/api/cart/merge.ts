import type { NextApiRequest, NextApiResponse } from 'next'
import { mergeCarts } from '../../../lib/services/cart.service'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token) {
      return res.status(401).json({ error: 'Token required for merge' })
    }

    const { anonymous_id } = req.body
    if (!anonymous_id) {
      return res.status(400).json({ error: 'anonymous_id is required' })
    }

    const result = await mergeCarts(anonymous_id, token)
    return res.json(result)
  } catch (error: any) {
    console.error('[api/cart/merge]', error)
    res.status(error.status || 500).json({ error: error.message || 'Internal Server Error' })
  }
}
