import type { NextApiRequest, NextApiResponse } from 'next'
import { requireToken } from '../../../lib/auth'
import { updateBanner, deleteBanner } from '../../../lib/services/banner.service'
import { errorResponse, methodNotAllowed } from '../../../lib/errors'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query
    if (!id || typeof id !== 'string') return res.status(400).json({ error: 'Banner ID is required' })

    const token = requireToken(req)

    switch (req.method) {
      case 'PUT': {
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
        const result = await updateBanner(Number(id), body, token)
        return res.status(200).json(result)
      }
      case 'DELETE': {
        const result = await deleteBanner(Number(id), token)
        return res.status(200).json(result)
      }
      default:
        return methodNotAllowed(res, ['PUT', 'DELETE'])
    }
  } catch (error) {
    return errorResponse(res, error)
  }
}
