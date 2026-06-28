import { searchBySelection } from '../../../../lib/services/autopart.service'
import { errorResponse } from '../../../../lib/errors'

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const productType = url.searchParams.get('productType') || ''
    const brand = url.searchParams.get('brand') || ''
    const model = url.searchParams.get('model') || ''
    const results = await searchBySelection(productType, brand, model)
    return Response.json(results)
  } catch (error) { return errorResponse(error) }
}
