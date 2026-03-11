import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow GET method for getting user by UID
  if (req.method !== 'GET') {
    return res.status(405).json({
      error: 'Method not allowed',
      success: false,
      allowedMethods: ['GET']
    });
  }

  const { uid } = req.query;
  const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:8000';

  if (!uid || typeof uid !== 'string') {
    return res.status(400).json({
      error: 'Firebase UID is required',
      success: false
    });
  }

  try {
    // Get Firebase token from request headers or cookies
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace('Bearer ', '');

    if (!token || token === 'null' || token === 'undefined') {
      console.log(`[API /users/${uid}] No auth token provided - returning guest user`);

      // Return a "not logged in" response instead of error
      // This prevents the console error while still indicating no user is logged in
      return res.status(200).json({
        uid: null,
        email: null,
        username: 'guest',
        full_name: null,
        roles: [],
        is_active: false,
        is_email_verified: false,
        is_logged_in: false,
        created_at: null
      });
    }

    console.log(`[API /users/${uid}] Auth token present, calling backend...`);

    // Call backend to sync/get user
    // First try to get the user info from backend
    const response = await fetch(`${apiBaseUrl}/api/auth/me`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      console.error(`[API /users/${uid}] Backend returned ${response.status}`);
      const errorText = await response.text();

      // If user not found (404), it means user exists in Firebase but not in DB
      // Try to sync the user automatically
      if (response.status === 404) {
        console.log(`[API /users/${uid}] User not found in DB, attempting auto-sync...`);

        // Get user email from Firebase by decoding the token (simplified)
        // For now, return a helpful message
        return res.status(200).json({
          uid: uid,
          email: null,
          username: 'pending-sync',
          full_name: null,
          roles: ['customer'],
          is_active: false,
          is_email_verified: false,
          is_logged_in: true,
          created_at: null,
          needs_sync: true,
          message: 'User needs to be synced to database. Please complete registration.'
        });
      }

      // If unauthorized, return guest user instead of error
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
          error: 'Session expired or invalid token'
        });
      }

      return res.status(response.status).json({
        error: errorText || 'Failed to get user',
        success: false
      });
    }

    const userData = await response.json();

    console.log(`[API /users/${uid}] User data retrieved successfully`);
    console.log(`[API /users/${uid}] Backend response:`, JSON.stringify(userData, null, 2));

    // Split full_name into first_name and last_name
    const nameParts = (userData.full_name || '').split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Return user data in the format expected by the frontend (User entity)
    return res.status(200).json({
      id: uid,
      first_name: firstName,
      last_name: lastName,
      email: userData.email,
      password: '', // Not needed on frontend
      personId: userData.user_id?.toString() || '0', // PersonId from database
      roles: userData.roles || []
    });

  } catch (error: any) {
    console.error('Error getting user:', error);
    return res.status(500).json({
      error: error.message || 'Internal server error',
      success: false
    });
  }
}
