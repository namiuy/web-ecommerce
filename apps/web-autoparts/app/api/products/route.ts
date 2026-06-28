import { searchProducts } from '../../../lib/services/product.service'
import { errorResponse } from '../../../lib/errors'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const results = await searchProducts(body.query || body.keywords?.join(' ') || '', body.limit || 50)
    return Response.json(results)
  } catch (error) {
    return errorResponse(error)
  }
}
