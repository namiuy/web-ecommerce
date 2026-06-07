import type { NextApiRequest, NextApiResponse } from 'next'
import { getToken, requireToken } from '../../../lib/auth'
import { listProductLists, createProductList } from '../../../lib/services/product-list.service'
import { errorResponse, methodNotAllowed } from '../../../lib/errors'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET': {
        const token = getToken(req)
        const lists = await listProductLists(token)
        return res.status(200).json(lists)
      }
      case 'POST': {
        const token = requireToken(req)
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
        const result = await createProductList(body, token)
        return res.status(200).json(result)
      }
      default:
        return methodNotAllowed(res, ['GET', 'POST'])
    }
  } catch (error) {
    return errorResponse(res, error)
  }
}
