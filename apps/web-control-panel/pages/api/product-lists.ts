import type { NextApiRequest, NextApiResponse } from 'next'
import { requireToken } from '../../lib/auth'
import {
  listProductLists,
  createProductList,
  updateProductList,
  addProductToList,
  removeProductFromList,
  deleteProductList,
} from '../../lib/services/product-list.service'
import { errorResponse, methodNotAllowed } from '../../lib/errors'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const token = requireToken(req)
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body

    switch (req.method) {
      case 'GET': {
        const lists = await listProductLists(token)
        return res.status(200).json(lists)
      }
      case 'POST': {
        // Add product to list or create new list
        if (body.listId && body.productCode) {
          const result = await addProductToList(body.listId, body.productCode, token)
          return res.status(200).json(result)
        }
        const result = await createProductList(body, token)
        return res.status(200).json(result)
      }
      case 'PUT': {
        const { id, ...data } = body
        if (id === undefined) return res.status(400).json({ error: 'List ID required' })
        const result = await updateProductList(id, data, token)
        return res.status(200).json(result)
      }
      case 'DELETE': {
        if (body.listId && body.productCode) {
          const result = await removeProductFromList(body.listId, body.productCode, token)
          return res.status(200).json(result)
        }
        const listId = body.id ?? req.query.id
        if (listId === undefined) return res.status(400).json({ error: 'List ID required' })
        const result = await deleteProductList(Number(listId), token)
        return res.status(200).json(result)
      }
      default:
        return methodNotAllowed(res, ['GET', 'POST', 'PUT', 'DELETE'])
    }
  } catch (error) {
    return errorResponse(res, error)
  }
}
