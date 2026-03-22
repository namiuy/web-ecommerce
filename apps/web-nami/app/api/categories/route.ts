import { errorResponse } from '../../../lib/errors'
import { listCategories } from '../../../lib/services/category.service'

export async function GET() {
  try {
    const categories = await listCategories()
    return Response.json(categories)
  } catch (error) {
    return errorResponse(error)
  }
}
