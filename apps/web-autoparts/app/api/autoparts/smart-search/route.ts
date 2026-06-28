import { smartSearch } from '../../../../lib/services/autopart.service'
import { errorResponse } from '../../../../lib/errors'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const results = await smartSearch(body.query, body.limit)
    return Response.json(results)
  } catch (error) { return errorResponse(error) }
}
