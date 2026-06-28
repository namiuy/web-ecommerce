import { getStock } from '../../../../lib/services/product.service'
import { errorResponse } from '../../../../lib/errors'

export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params
    const data = await getStock(id)
    return Response.json(data)
  } catch (error) {
    return errorResponse(error)
  }
}
