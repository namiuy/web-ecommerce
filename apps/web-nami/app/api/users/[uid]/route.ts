import { errorResponse } from '../../../../lib/errors'
import { config } from '../../../../lib/config'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: { params: { uid: string } }
) {
  try {
    const { uid } = params

    // Get auth token from cookie or Authorization header
    const cookieStore = cookies()
    const cookieToken = cookieStore.get('token')?.value
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '') || cookieToken || null

    if (!token) {
      console.log(`[/api/users/${uid}] No auth token — returning guest user`)
      return Response.json({
        uid: null,
        email: null,
        username: 'guest',
        full_name: null,
        roles: [],
        is_active: false,
        is_email_verified: false,
        is_logged_in: false,
        created_at: null,
      })
    }

    console.log(`[/api/users/${uid}] Fetching user from backend...`)

    // Call backend /api/auth/me endpoint
    // Remove /api from config.apiBaseUrl since auth endpoints already include it
    if (!config.apiBaseUrl) {
      throw new Error('NEXT_PUBLIC_API_BASE_URL is not configured')
    }
    const apiBaseUrlRaw = config.apiBaseUrl.replace('/api', '')
    const backendUrl = `${apiBaseUrlRaw}/api/auth/me`

    console.log(`[/api/users/${uid}] Backend URL: ${backendUrl}`)
    console.log(`[/api/users/${uid}] Token prefix: ${token.substring(0, 20)}...`)

    let response;
    try {
      response = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        signal: AbortSignal.timeout(5000), // 5 second timeout
      })
    } catch (fetchError: any) {
      console.error(`[/api/users/${uid}] Fetch error:`, fetchError.message)
      // If backend is not available, return guest user
      if (fetchError.name === 'TimeoutError' || fetchError.code === 'ECONNREFUSED') {
        console.warn(`[/api/users/${uid}] Backend unavailable, returning guest user`)
        return Response.json({
          uid: null,
          email: null,
          username: 'guest',
          full_name: null,
          roles: [],
          is_active: false,
          is_email_verified: false,
          is_logged_in: false,
          created_at: null,
          error: 'Backend service unavailable',
        })
      }
      throw fetchError
    }

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`[/api/users/${uid}] Backend returned ${response.status}: ${errorText}`)

      // 404: user in Firebase but not in DB
      if (response.status === 404) {
        console.log(`[/api/users/${uid}] User not found in DB, needs sync`)
        return Response.json({
          uid,
          email: null,
          username: 'pending-sync',
          full_name: null,
          roles: ['customer'],
          is_active: false,
          is_email_verified: false,
          is_logged_in: true,
          created_at: null,
          needs_sync: true,
          message: 'User needs to be synced to database. Please complete registration.',
        })
      }

      // 401/403: return guest user
      if (response.status === 401 || response.status === 403) {
        return Response.json({
          uid: null,
          email: null,
          username: 'guest',
          full_name: null,
          roles: [],
          is_active: false,
          is_email_verified: false,
          is_logged_in: false,
          created_at: null,
          error: 'Session expired or invalid token',
        })
      }

      throw new Error(errorText || `Failed to get user (HTTP ${response.status})`)
    }

    const userData = await response.json()

    console.log('[/api/users/[uid]] Backend response:', userData)

    return Response.json({
      uid,
      user_id: userData.user_id,
      personId: userData.user_id,
      email: userData.email,
      username: userData.username,
      full_name: userData.full_name,
      name: userData.full_name,
      roles: userData.roles,
      is_active: userData.is_active,
      is_email_verified: userData.is_email_verified,
      is_logged_in: true,
      created_at: userData.created_at,
    })
  } catch (error) {
    console.error('[/api/users/[uid]] Error:', error)
    return errorResponse(error)
  }
}
