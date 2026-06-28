import { getToken } from '../../../../../lib/auth'
import { errorResponse, badRequest } from '../../../../../lib/errors'
import { getRelatedProducts } from '../../../../../lib/services/product.service'

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params
    if (!id) return badRequest('Product ID is required')

    const token = getToken(request)
    const result = await getRelatedProducts(id, token)
    return Response.json(result)
  } catch (error) {
    return errorResponse(error)
  }
}
