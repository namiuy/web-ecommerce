import { getModelsByBrandAndProductType } from '../../../../lib/services/autopart.service'
import { errorResponse } from '../../../../lib/errors'

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const productType = url.searchParams.get('productType') || ''
    const brand = url.searchParams.get('brand') || ''
    const models = await getModelsByBrandAndProductType(productType, brand)
    return Response.json(models)
  } catch (error) { return errorResponse(error) }
}
