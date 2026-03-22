import { errorResponse } from '../../../lib/errors'
import { listStates } from '../../../lib/services/state.service'

export async function GET() {
  try {
    const states = await listStates()
    return Response.json(states)
  } catch (error) {
    return errorResponse(error)
  }
}
