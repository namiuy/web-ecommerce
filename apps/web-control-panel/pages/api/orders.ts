import type { NextApiRequest, NextApiResponse } from 'next'
import { requireToken } from '../../lib/auth'
import { listMyOrders, listOrdersByGuid, checkout } from '../../lib/services/order.service'
import { errorResponse, methodNotAllowed } from '../../lib/errors'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const token = requireToken(req)

    switch (req.method) {
      case 'GET': {
        const { guid, companyId } = req.query
        let result
        if (guid && typeof guid === 'string') {
          result = await listOrdersByGuid(guid, companyId as string | undefined, token)
        } else {
          result = await listMyOrders(token)
        }
        return res.status(200).json(result)
      }

      case 'POST': {
        const result = await checkout(req.body, token)
        return res.status(200).json(result)
      }

      default:
        return methodNotAllowed(res, ['GET', 'POST'])
    }
  } catch (error) {
    return errorResponse(res, error)
  }
}
