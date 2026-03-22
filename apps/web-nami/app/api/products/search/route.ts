import { getToken } from '../../../../lib/auth'
import { errorResponse } from '../../../../lib/errors'
import { searchProducts } from '../../../../lib/services/product.service'

export async function GET(request: Request) {
  try {
    const token = getToken(request)
    const { searchParams } = new URL(request.url)

    const brand = searchParams.get('b')
    const category = searchParams.get('c')
    const words = searchParams.get('t')
    const sortBy = searchParams.get('sortBy') || 'rel'
    const index = parseInt(searchParams.get('index') || '0')

    const filters: { brand?: number; category?: string; words?: string[] } = {}
    if (brand) filters.brand = parseInt(brand)
    if (category) filters.category = category
    if (words) filters.words = words.split(',')

    const result = await searchProducts(filters, sortBy, index, token)
    return Response.json(result)
  } catch (error) {
    return errorResponse(error)
  }
}
