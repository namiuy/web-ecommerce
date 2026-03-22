import { NextRequest } from 'next/server'
import { apiFetch } from '../../../../lib/api-client'
import { errorResponse } from '../../../../lib/errors'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const result = await apiFetch('/contact/email', { method: 'POST', body })
    return Response.json(result)
  } catch (error) {
    return errorResponse(error)
  }
}
