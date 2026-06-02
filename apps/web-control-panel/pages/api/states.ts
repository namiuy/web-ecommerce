import type { NextApiRequest, NextApiResponse } from 'next'
import { listStates } from '../../lib/services/state.service'
import { errorResponse, methodNotAllowed } from '../../lib/errors'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET'])
  try {
    const states = await listStates()
    return res.status(200).json(states)
  } catch (error) {
    return errorResponse(res, error)
  }
}
