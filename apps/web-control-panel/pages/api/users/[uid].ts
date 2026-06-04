import type { NextApiRequest, NextApiResponse } from 'next'
import { config } from '../../../lib/config'
import { errorResponse } from '../../../lib/errors'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { uid } = req.query
    if (!uid || typeof uid !== 'string') {
      return res.status(400).json({ error: 'Firebase UID is required' })
    }

    // Get auth token from Authorization header
    const authHeader = req.headers.authorization
    const token = authHeader?.replace('Bearer ', '') || null

    if (!token || token === 'null' || token === 'undefined') {
      console.log(`[/api/users/${uid}] No auth token — returning guest user`)
      return res.status(200).json({
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

    if (!config.apiBaseUrl || config.apiBaseUrl === 'undefined') {
      throw new Error('NEXT_PUBLIC_API_BASE_URL is not configured')
    }

    const backendUrl = `${config.apiBaseUrl}/auth/me`
    console.log(`[/api/users/${uid}] Backend URL: ${backendUrl}`)

    let response
    try {
      response = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        signal: AbortSignal.timeout(30000),
      })
    } catch (fetchError: any) {
      console.error(`[/api/users/${uid}] Fetch error:`, fetchError)

      if (fetchError.name === 'TimeoutError' || fetchError.code === 'ECONNREFUSED' || fetchError.message?.includes('fetch failed')) {
        console.warn(`[/api/users/${uid}] Backend unavailable, returning guest user`)
        return res.status(200).json({
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

      if (response.status === 404) {
        return res.status(200).json({
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

      if (response.status === 401 || response.status === 403) {
        return res.status(200).json({
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
    console.log(`[/api/users/${uid}] User data retrieved successfully`)

    // Split full_name into first_name and last_name for frontend
    const nameParts = (userData.full_name || '').split(' ')
    const firstName = nameParts[0] || ''
    const lastName = nameParts.slice(1).join(' ') || ''

    return res.status(200).json({
      id: uid,
      first_name: firstName,
      last_name: lastName,
      email: userData.email,
      password: '',
      personId: userData.user_id?.toString() || '0',
      roles: userData.roles || [],
    })
  } catch (error) {
    return errorResponse(res, error)
  }
}
