import { getProductTypes } from '../../../../lib/services/autopart.service'
import { errorResponse } from '../../../../lib/errors'

export async function GET() {
  try {
    const types = await getProductTypes()
    return Response.json(types)
  } catch (error) { return errorResponse(error) }
}
