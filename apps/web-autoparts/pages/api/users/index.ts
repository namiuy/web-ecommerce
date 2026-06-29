import type { NextApiRequest, NextApiResponse } from 'next'
import { registerUser } from '../../../lib/services/user.service'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  try {
    const result = await registerUser(req.body)
    res.json(result)
  } catch (error: any) {
    console.error('[api/users]', error)
    res.status(error.status || 500).json({ error: error.message || 'Internal Server Error' })
  }
}
