import { getToken } from '../../../../lib/auth'
import { errorResponse, badRequest } from '../../../../lib/errors'
import { config } from '../../../../lib/config'

export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params
    if (!id) return badRequest('Product code is required')

    const token = getToken(request)
    const { searchParams } = new URL(request.url)
    const server = searchParams.get('server') || 'lindo4'

    console.log(`[/api/stocks/${id}] Fetching stock from backend, server=${server}`)

    // Call backend /api/stock endpoint directly
    // Remove /api from config.apiBaseUrl since stock endpoint already includes it
    if (!config.apiBaseUrl || config.apiBaseUrl === 'undefined') {
      throw new Error('NEXT_PUBLIC_API_BASE_URL is not configured')
    }
    const apiBaseUrlRaw = config.apiBaseUrl.replace('/api', '')
    const params_string = new URLSearchParams({
      code: id,
      server: server,
    }).toString()

    let response;
    try {
      response = await fetch(`${apiBaseUrlRaw}/api/stock?${params_string}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        signal: AbortSignal.timeout(30000), // 30 second timeout (increased from 5)
      })
    } catch (fetchError: any) {
      console.error(`[/api/stocks/${id}] Fetch error:`, fetchError)
      console.error(`[/api/stocks/${id}] Fetch error name:`, fetchError.name)
      console.error(`[/api/stocks/${id}] Fetch error code:`, fetchError.code)
      console.error(`[/api/stocks/${id}] Fetch error cause:`, fetchError.cause)
      console.error(`[/api/stocks/${id}] Backend URL that failed:`, `${apiBaseUrlRaw}/api/stock?${params_string}`)

      // If backend is not available, return empty stock with success flag
      if (fetchError.name === 'TimeoutError' || fetchError.code === 'ECONNREFUSED' || fetchError.message?.includes('fetch failed')) {
        console.warn(`[/api/stocks/${id}] Backend unavailable, returning empty stock`)
        return Response.json({
          code: id,
          total: 0,
          nami: 0,
          clima: 0,
          sircal: 0,
          lafelor: 0,
          alodenar: 0,
          error: 'Backend service unavailable'
        })
      }
      throw fetchError
    }

    if (!response.ok) {
      console.error(`[/api/stocks/${id}] Backend returned ${response.status}`)
      const errorText = await response.text()
      throw new Error(errorText || `Failed to get stock (HTTP ${response.status})`)
    }

    const data = await response.json()

    console.log(`[/api/stocks/${id}] Backend response:`, data)

    if (data.success === false) {
      throw new Error('Stock request failed')
    }

    return Response.json(data.stock)
  } catch (error) {
    return errorResponse(error)
  }
}
