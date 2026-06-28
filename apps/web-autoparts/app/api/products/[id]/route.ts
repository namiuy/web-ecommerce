import { getProductByCode } from '../../../../lib/services/product.service'
import { errorResponse } from '../../../../lib/errors'

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params
    const product = await getProductByCode(id)
    return Response.json(product)
  } catch (error) {
    return errorResponse(error)
  }
}
