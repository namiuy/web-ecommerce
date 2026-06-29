import type { NextApiRequest, NextApiResponse } from 'next'
import { getUserByFirebaseUid } from '../../../lib/services/user.service'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { uid } = req.query
    if (!uid || typeof uid !== 'string') {
      return res.status(400).json({ error: 'User UID is required' })
    }

    const authHeader = req.headers.authorization
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null

    const user = await getUserByFirebaseUid(uid, token)
    res.json(user)
  } catch (error: any) {
    console.error('[api/users/[uid]]', error)
    res.status(error.status || 500).json({ error: error.message || 'Internal Server Error' })
  }
}
