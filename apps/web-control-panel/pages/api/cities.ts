import type { NextApiRequest, NextApiResponse } from 'next'
import { listCities } from '../../lib/services/city.service'
import { errorResponse, methodNotAllowed } from '../../lib/errors'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET'])
  try {
    const cities = await listCities()
    return res.status(200).json(cities)
  } catch (error) {
    return errorResponse(res, error)
  }
}
