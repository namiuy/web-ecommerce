import type { NextApiRequest, NextApiResponse } from 'next'
import { requireToken } from '../../lib/auth'
import { getPerson, updatePerson } from '../../lib/services/person.service'
import { errorResponse, methodNotAllowed } from '../../lib/errors'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const token = requireToken(req)

    switch (req.method) {
      case 'GET': {
        const id = req.query.id as string
        if (!id) return res.status(400).json({ error: 'Person ID is required' })
        const person = await getPerson(id, token)
        return res.status(200).json(person)
      }
      case 'PUT': {
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
        const result = await updatePerson(body, token)
        return res.status(200).json({ success: result })
      }
      default:
        return methodNotAllowed(res, ['GET', 'PUT'])
    }
  } catch (error) {
    return errorResponse(res, error)
  }
}
