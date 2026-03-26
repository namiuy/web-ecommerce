import { errorResponse } from '../../../lib/errors'
import { listBrands } from '../../../lib/services/brand.service'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const brands = await listBrands()
    return Response.json(brands)
  } catch (error) {
    return errorResponse(error)
  }
}
