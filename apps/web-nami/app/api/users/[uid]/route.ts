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
    const apiBaseUrlRaw = config.apiBaseUrl.replace('/api', '')
    const response = await fetch(`${apiBaseUrlRaw}/api/auth/me`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      console.error(`[/api/users/${uid}] Backend returned ${response.status}`)

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

      const errorText = await response.text()
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
    return errorResponse(error)
  }
}
