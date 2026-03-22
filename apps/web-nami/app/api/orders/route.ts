import { requireToken } from '../../../lib/auth'
import { errorResponse } from '../../../lib/errors'
import {
  listMyOrders,
  listOrdersByGuid,
  checkout,
} from '../../../lib/services/order.service'

export async function GET(request: Request) {
  try {
    const token = requireToken(request)
    const { searchParams } = new URL(request.url)
    const guid = searchParams.get('guid')

    const result = guid
      ? await listOrdersByGuid(guid, token)
      : await listMyOrders(token)

    return Response.json(result)
  } catch (error) {
    return errorResponse(error)
  }
}

export async function POST(request: Request) {
  try {
    const token = requireToken(request)
    const body = await request.json()

    console.log('[API /orders POST] Received checkout data:', body)
    const order = await checkout(body, token)
    console.log('[API /orders POST] Checkout result:', order)

    return Response.json(order)
  } catch (error) {
    console.error('[API /orders POST] Error:', error)
    return errorResponse(error)
  }
}
