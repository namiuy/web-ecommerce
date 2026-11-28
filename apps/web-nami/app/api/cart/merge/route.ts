import { requireToken } from '../../../../lib/auth'
import { errorResponse } from '../../../../lib/errors'
import { mergeCarts } from '../../../../lib/services/cart.service'

export async function POST(request: Request) {
  try {
    const token = requireToken(request)
    const { anonymous_id } = await request.json()
    if (!anonymous_id) {
      return Response.json({ error: 'anonymous_id is required' }, { status: 400 })
    }
    const result = await mergeCarts(anonymous_id, token)
    return Response.json(result)
  } catch (error) {
    return errorResponse(error)
  }
}
