import type { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from '../../../lib/auth'
import { getUserByFirebaseUid } from '../../../lib/services/user.service'
import { errorResponse, methodNotAllowed } from '../../../lib/errors'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET'])

  try {
    const { uid } = req.query
    if (!uid || typeof uid !== 'string') {
      return res.status(400).json({ error: 'Firebase UID is required' })
    }

    const token = getToken(req)
    const userData = await getUserByFirebaseUid(uid, token)

    // Transform to format expected by frontend (User entity)
    if (!userData.uid || userData.username === 'guest') {
      return res.status(200).json(userData)
    }

    const nameParts = (userData.full_name || '').split(' ')
    const firstName = nameParts[0] || ''
    const lastName = nameParts.slice(1).join(' ') || ''

    return res.status(200).json({
      id: uid,
      first_name: firstName,
      last_name: lastName,
      email: userData.email,
      password: '',
      personId: userData.user_id?.toString() || '0',
      roles: userData.roles || [],
    })
  } catch (error) {
    return errorResponse(res, error)
  }
}
