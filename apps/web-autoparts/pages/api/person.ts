import type { NextApiRequest, NextApiResponse } from 'next'
import { apiFetch } from '../../lib/api-client'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '') || ''

    if (req.method === 'GET') {
      const id = req.query.id as string
      if (!id) return res.status(400).json({ error: 'Person ID is required' })
      const person = await apiFetch<any>(`/persons/${id}`, { token })
      return res.json(person.person ?? person)
    }

    if (req.method === 'PUT') {
      const person = req.body
      await apiFetch(`/persons/${person.id}`, { method: 'PUT', body: person, token })
      return res.json({ success: true })
    }

    res.status(405).json({ error: 'Method not allowed' })
  } catch (error: any) {
    console.error('[api/person]', error.message)
    res.status(error.status || 500).json({ error: error.message || 'Internal Server Error' })
  }
}
