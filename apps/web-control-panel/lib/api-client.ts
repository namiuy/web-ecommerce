import { config } from './config'

type ApiFetchOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
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
    timeout = 30_000, // Increased from 10s to 30s
    baseUrl = config.apiBaseUrl,
  } = options

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  let response;
  // Ensure trailing slash to avoid FastAPI 307 redirects
  const path = endpoint.includes('?') ? endpoint : (endpoint.endsWith('/') ? endpoint : `${endpoint}/`);
  const url = `${baseUrl}${path}`;
  const fetchOptions = {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(timeout),
    redirect: 'manual' as RequestRedirect,
  }

  try {
    response = await fetch(url, fetchOptions)

    // Handle 307/308 redirects manually to preserve method and body
    if (response.status === 307 || response.status === 308) {
      const location = response.headers.get('location')
      if (location) {
        response = await fetch(location, { ...fetchOptions, redirect: 'follow' })
      }
    }
  } catch (fetchError: any) {
    console.error(`[apiFetch] Fetch error for ${method} ${url}:`, fetchError)
    console.error(`[apiFetch] Error name: ${fetchError.name}, code: ${fetchError.code}`)

    // Throw a more descriptive error for network failures
    if (fetchError.name === 'TimeoutError' || fetchError.code === 'ECONNREFUSED' || fetchError.message?.includes('fetch failed')) {
      throw new ApiError(503, `Backend service unavailable: ${fetchError.message}`)
    }
    throw fetchError
  }

  if (!response.ok) {
    const errorText = await response.text()
    throw new ApiError(response.status, errorText || `HTTP ${response.status}`)
  }

  return await response.json()
}
