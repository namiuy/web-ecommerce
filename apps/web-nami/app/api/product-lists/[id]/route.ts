import { errorResponse } from '../../../../lib/errors'
import { getProductList } from '../../../../lib/services/product-list.service'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const list = await getProductList(parseInt(params.id))
    return Response.json(list)
  } catch (error) {
    return errorResponse(error)
  }
}
