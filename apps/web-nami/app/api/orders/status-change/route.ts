import { requireToken } from '../../../../lib/auth'
import { errorResponse } from '../../../../lib/errors'
import { apiFetch } from '../../../../lib/api-client'

export async function POST(request: Request) {
  try {
    const token = requireToken(request)
    const body = await request.json()

    // Proxy directly to backend
    const result = await apiFetch('/orders/status-change', {
      method: 'POST',
      body,
      token,
    })

    return Response.json(result)
  } catch (error) {
    return errorResponse(error)
  }
}
