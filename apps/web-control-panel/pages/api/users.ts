import type { NextApiRequest, NextApiResponse } from 'next'
import { registerUser } from '../../lib/services/user.service'
import { errorResponse, methodNotAllowed } from '../../lib/errors'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST'])
  try {
    const userData = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
    const result = await registerUser(userData)
    return res.status(200).json(result)
  } catch (error) {
    return errorResponse(res, error)
  }
}
