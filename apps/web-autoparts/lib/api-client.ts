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
    timeout = 30_000, // Increased from 10s to 30s
    baseUrl = config.apiBaseUrl,
  } = options

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'User-Agent': 'web-autoparts/1.0',
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  let response;
  const url = `${baseUrl}${endpoint}`;

  try {
    response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(timeout),
    })
  } catch (fetchError: any) {
    console.error(`[apiFetch] Fetch error for ${method} ${url}:`, fetchError?.message)
    console.error(`[apiFetch] Error name: ${fetchError.name}, code: ${fetchError.code}, cause:`, fetchError.cause)

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
