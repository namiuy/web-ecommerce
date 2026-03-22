import { getToken } from '../../../../lib/auth'
import { errorResponse, badRequest } from '../../../../lib/errors'
import { getStockByCode } from '../../../../lib/services/stock.service'

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params
    if (!id) return badRequest('Product code is required')

    const token = getToken(request)
    const { searchParams } = new URL(request.url)
    const server = searchParams.get('server') || undefined

    const stock = await getStockByCode(id, server, token)
    return Response.json(stock)
  } catch (error) {
    return errorResponse(error)
  }
}
