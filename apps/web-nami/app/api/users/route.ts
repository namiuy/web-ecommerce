import { errorResponse } from '../../../lib/errors'
import { registerUser } from '../../../lib/services/user.service'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const result = await registerUser(body)
    return Response.json(result)
  } catch (error) {
    return errorResponse(error)
  }
}
