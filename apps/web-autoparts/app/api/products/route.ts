import { requireToken } from '../../../lib/auth'
import { errorResponse } from '../../../lib/errors'
import { addProduct } from '../../../lib/services/product.service'

export async function POST(request: Request) {
  try {
    const token = requireToken(request)
    const body = await request.json()
    const product = await addProduct(body, token)
    return Response.json(product)
  } catch (error) {
    return errorResponse(error)
  }
}
