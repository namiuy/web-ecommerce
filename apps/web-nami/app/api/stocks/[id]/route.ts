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
    if (!config.apiBaseUrl) {
      throw new Error('API_BASE_URL is not configured')
    }
    const apiBaseUrlRaw = config.apiBaseUrl.replace('/api', '')
    const params_string = new URLSearchParams({
      code: id,
      server: server,
    }).toString()

    const response = await fetch(`${apiBaseUrlRaw}/api/stock?${params_string}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    })

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
