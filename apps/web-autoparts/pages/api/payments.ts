import type { NextApiRequest, NextApiResponse } from 'next'
import { apiFetch } from '../../lib/api-client'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const methods = await apiFetch<any[]>('/payments')
    res.json(methods)
  } catch (error: any) {
    console.error('[api/payments]', error.message)
    res.status(error.status || 500).json({ error: error.message })
  }
}
