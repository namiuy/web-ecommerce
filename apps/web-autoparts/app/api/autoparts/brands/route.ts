import { getBrandsByProductType } from '../../../../lib/services/autopart.service'
import { errorResponse } from '../../../../lib/errors'

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const productType = url.searchParams.get('productType') || ''
    const brands = await getBrandsByProductType(productType)
    return Response.json(brands)
  } catch (error) { return errorResponse(error) }
}
