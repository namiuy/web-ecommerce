import type { NextApiRequest, NextApiResponse } from 'next'
import { apiFetch } from '../../lib/api-client'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const raw = await apiFetch<any[]>('/states')
    const mapped = raw.map((s: any) => ({
      id: s.state_id ?? s.id,
      code: s.state_id ?? s.code ?? s.id,
      name: s.state_name ?? s.name,
    }))
    res.json(mapped)
  } catch (error: any) {
    res.status(error.status || 500).json({ error: error.message })
  }
}
