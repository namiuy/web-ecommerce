import type { NextApiResponse } from 'next'
import { ApiError } from './api-client'
import { UnauthorizedError } from './auth'

export function errorResponse(res: NextApiResponse, error: unknown): void {
  console.error('[errorResponse] Full error:', error)

  if (error instanceof UnauthorizedError) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }
  if (error instanceof ApiError) {
    res.status(error.status).json({ error: error.message })
    return
  }
  if (error instanceof DOMException && error.name === 'TimeoutError') {
    res.status(504).json({ error: 'Upstream timeout' })
    return
  }
  const message = error instanceof Error ? error.message : 'Internal server error'
  res.status(500).json({ error: message })
}

export function methodNotAllowed(res: NextApiResponse, allowed: string[]): void {
  res.setHeader('Allow', allowed.join(', '))
  res.status(405).json({ error: `Method not allowed. Allowed: ${allowed.join(', ')}` })
}
