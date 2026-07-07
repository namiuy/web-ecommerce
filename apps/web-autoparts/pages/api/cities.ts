import type { NextApiRequest, NextApiResponse } from 'next'
import { apiFetch } from '../../lib/api-client'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const raw = await apiFetch<any[]>('/cities')
    const data = Array.isArray(raw) ? raw : (raw as any).data ?? raw
    const mapped = data.map((c: any) => ({
      id: c.city_id ?? c.id,
      name: c.city_name ?? c.name,
      stateId: c.state_id ?? c.stateId,
      state: c.state_name ?? c.state ?? '',
    }))
    res.json(mapped)
  } catch (error: any) {
    res.status(error.status || 500).json({ error: error.message })
  }
}
