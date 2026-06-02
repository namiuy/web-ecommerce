import type { NextApiRequest } from 'next'

export function getToken(req: NextApiRequest): string | null {
  const authHeader = req.headers.authorization
  if (!authHeader) return null
  const parts = authHeader.split(' ')
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null
  return parts[1]
}

export function requireToken(req: NextApiRequest): string {
  const token = getToken(req)
  if (!token) {
    throw new UnauthorizedError()
  }
  return token
}

export class UnauthorizedError extends Error {
  constructor() {
    super('Unauthorized')
    this.name = 'UnauthorizedError'
  }
}
