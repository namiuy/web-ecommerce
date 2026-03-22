import { requireToken } from '../../../../lib/auth'
import { errorResponse } from '../../../../lib/errors'
import { listAllOrders } from '../../../../lib/services/order.service'

export async function GET(request: Request) {
  try {
    const token = requireToken(request)
    const result = await listAllOrders(token)
    return Response.json(result)
  } catch (error) {
    return errorResponse(error)
  }
}
