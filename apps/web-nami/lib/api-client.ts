import { config } from './config'

type ApiFetchOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: unknown
  token?: string | null
  timeout?: number
  /** Override base URL (for stock which uses API_BASE_URL without /api path) */
  baseUrl?: string
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

export async function apiFetch<T = unknown>(
  endpoint: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const {
    method = 'GET',
    body,
    token,
    timeout = 10_000,
    baseUrl = config.apiBaseUrl,
  } = options

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${baseUrl}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(timeout),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new ApiError(response.status, errorText || `HTTP ${response.status}`)
  }

  return await response.json()
}
