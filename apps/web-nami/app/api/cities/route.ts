import { errorResponse } from '../../../lib/errors'
import { listCities } from '../../../lib/services/city.service'

export async function GET() {
  try {
    const cities = await listCities()
    return Response.json(cities)
  } catch (error) {
    return errorResponse(error)
  }
}
