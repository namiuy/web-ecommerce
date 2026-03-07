import type { NextApiRequest, NextApiResponse } from 'next';
import { methodNotAllowed, sendResult } from './_helpers';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST method for user registration
  if (req.method !== 'POST') {
    return methodNotAllowed(res, ['POST']);
  }

  try {
    const userData = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    // The registration flow:
    // 1. Firebase user is created in the frontend (useAddUser hook)
    // 2. This endpoint receives the user data + Firebase UID
    // 3. We sync the user to the backend User table via /api/auth/sync-user
    // 4. We create a person record in the backend

    const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:8000';

    console.log('[API /users POST] Starting user registration for:', userData.email);

    // Step 1: Sync user to backend User table (this also sends welcome email!)
    const syncUserData = {
      firebase_uid: userData.uid,
      email: userData.email,
      role: 'customer',
      full_name: `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || null
    };

    console.log('[API /users POST] Syncing user to backend...');
    const syncResponse = await fetch(`${apiBaseUrl}/api/auth/sync-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(syncUserData),
    });

    if (!syncResponse.ok) {
      const errorText = await syncResponse.text();
      console.error('[API /users POST] Failed to sync user:', errorText);
      return res.status(syncResponse.status).json({
        error: errorText || 'Failed to sync user to database',
        success: false
      });
    }

    const syncResult = await syncResponse.json();
    console.log('[API /users POST] User synced successfully:', syncResult.message);

    // Step 2: Create person record in FastAPI backend (optional, for additional data)
    const personData = {
      name: userData.first_name,
      lastName: userData.last_name,
      email: userData.email,
      phone: userData.phone,
      description: `Firebase UID: ${userData.uid}`,
      addresses: [
        {
          address: userData.address,
          observation: "",
          zipCode: 0,
          cityId: parseInt(userData.city),
          recipient: `${userData.first_name} ${userData.last_name}`
        }
      ],
      phones: [
        {
          phone: userData.phone,
          type: "CEL",
          observation: ""
        }
      ],
      emails: [userData.email]
    };

    console.log('[API /users POST] Creating person record...');
    const response = await fetch(`${apiBaseUrl}/api/persons`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(personData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[API /users POST] Failed to create person:', errorText);
      // Don't fail the registration if person creation fails
      // The user is already synced to the User table
      console.warn('[API /users POST] Person creation failed but user is synced');
    } else {
      const result = await response.json();
      console.log('[API /users POST] Person created successfully');
    }

    // Return success - user is synced and welcome email was sent
    return res.status(200).json({
      success: true,
      message: 'User registered successfully',
      user: syncResult.user
    });

  } catch (error: any) {
    console.error('Error creating user:', error);
    return res.status(500).json({
      error: error.message || 'Internal server error',
      success: false
    });
  }
}
