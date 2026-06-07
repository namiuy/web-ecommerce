import type { NextApiRequest, NextApiResponse } from 'next'
import { requireToken } from '../../../lib/auth'
import {
  updateProductList,
  addProductToList,
  removeProductFromList,
  deleteProductList,
} from '../../../lib/services/product-list.service'
import { errorResponse, methodNotAllowed } from '../../../lib/errors'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query
    if (!id || typeof id !== 'string') return res.status(400).json({ error: 'List ID is required' })

    const token = requireToken(req)
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body

    switch (req.method) {
      case 'PUT': {
        const result = await updateProductList(Number(id), body, token)
        return res.status(200).json(result)
      }
      case 'POST': {
        // Add product to list
        const result = await addProductToList(Number(id), body.productCode, token)
        return res.status(200).json(result)
      }
      case 'DELETE': {
        // Remove product or delete list
        if (body?.productCode) {
          const result = await removeProductFromList(Number(id), body.productCode, token)
          return res.status(200).json(result)
        }
        const result = await deleteProductList(Number(id), token)
        return res.status(200).json(result)
      }
      default:
        return methodNotAllowed(res, ['PUT', 'POST', 'DELETE'])
    }
  } catch (error) {
    return errorResponse(res, error)
  }
}
