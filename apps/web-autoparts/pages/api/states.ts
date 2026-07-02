import type { NextApiRequest, NextApiResponse } from 'next'
import { apiFetch } from '../../lib/api-client'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const raw = await apiFetch<any[]>('/states')
    res.json(raw)
  } catch (error: any) {
    res.status(error.status || 500).json({ error: error.message })
  }
}
