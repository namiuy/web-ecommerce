import { ApiError } from './api-client'
import { UnauthorizedError } from './auth'

export function errorResponse(error: unknown): Response {
  // Log full error details for debugging
  console.error('[errorResponse] Full error:', error)
  console.error('[errorResponse] Error stack:', error instanceof Error ? error.stack : 'No stack')

  if (error instanceof UnauthorizedError) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (error instanceof ApiError) {
    return Response.json({ error: error.message, details: error }, { status: error.status })
  }
  if (error instanceof DOMException && error.name === 'TimeoutError') {
    return Response.json({ error: 'Upstream timeout' }, { status: 504 })
  }
  const message = error instanceof Error ? error.message : 'Internal server error'
  const details = error instanceof Error ? { message: error.message, stack: error.stack } : { error: String(error) }
  return Response.json({ error: message, details }, { status: 500 })
}

export function unauthorized() {
  return Response.json({ error: 'Unauthorized' }, { status: 401 })
}

export function badRequest(message: string) {
  return Response.json({ error: message }, { status: 400 })
}

export function notFound(message = 'Not found') {
  return Response.json({ error: message }, { status: 404 })
}
