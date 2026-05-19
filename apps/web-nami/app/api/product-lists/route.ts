import { errorResponse } from '../../../lib/errors'
import { listProductLists } from '../../../lib/services/product-list.service'

export async function GET() {
  try {
    const lists = await listProductLists()
    return Response.json(lists)
  } catch (error) {
    return errorResponse(error)
  }
}
