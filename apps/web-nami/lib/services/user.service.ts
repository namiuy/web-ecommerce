import { config } from '../config';

// --- Helper to get raw API URL (without /api suffix) ---

const getApiBaseUrlRaw = () => {
  if (!config.apiBaseUrl || config.apiBaseUrl === 'undefined') {
    throw new Error('NEXT_PUBLIC_API_BASE_URL is not configured')
  }
  return config.apiBaseUrl.replace('/api', '')
}

// --- Client types ---

type RegisterUserData = {
  uid: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  address?: string;
  city?: string;
};

type UserResponse = {
  uid: string | null;
  user_id?: number;
  personId?: number;
  email: string | null;
  username: string;
  full_name: string | null;
  name?: string | null;
  roles: string[];
  is_active: boolean;
  is_email_verified: boolean;
  is_logged_in: boolean;
  created_at: string | null;
  needs_sync?: boolean;
  message?: string;
  error?: string;
};

// --- Service functions ---

export async function registerUser(userData: RegisterUserData): Promise<{ success: boolean; message: string; user?: unknown }> {
  const syncUserData = {
    firebase_uid: userData.uid,
    email: userData.email,
    role: 'customer',
    full_name: `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || null,
  };

  console.log('[user.service] Syncing user to backend...');
  const syncResponse = await fetch(`${getApiBaseUrlRaw()}/api/auth/sync-user`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(syncUserData),
  });

  if (!syncResponse.ok) {
    const errorText = await syncResponse.text();
    console.error('[user.service] Failed to sync user:', errorText);
    throw new Error(errorText || 'Failed to sync user to database');
  }

  const syncResult = await syncResponse.json();
  console.log('[user.service] User synced successfully:', syncResult.message);

  // Step 2: Create person record (non-blocking — don't fail if this fails)
  const personData = {
    name: userData.first_name,
    last_name: userData.last_name,
    email: userData.email,
    phone: userData.phone,
    description: `Firebase UID: ${userData.uid}`,
    addresses: [
      {
        address: userData.address,
        observation: '',
        zip_code: 0,
        city_id: userData.city ? parseInt(userData.city) : 0,
        recipient: `${userData.first_name || ''} ${userData.last_name || ''}`.trim(),
      },
    ],
    phones: [
      {
        phone: userData.phone,
        type: 'CEL',
        observation: '',
      },
    ],
    emails: [userData.email],
  };

  console.log('[user.service] Creating person record...');
  try {
    const response = await fetch(`${config.apiBaseUrl}/persons`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(personData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[user.service] Failed to create person:', errorText);
      console.warn('[user.service] Person creation failed but user is synced');
    } else {
      console.log('[user.service] Person created successfully');
    }
  } catch (err) {
    console.warn('[user.service] Person creation error (non-blocking):', err);
  }

  return {
    success: true,
    message: 'User registered successfully',
    user: syncResult.user,
  };
}

export async function getUserByFirebaseUid(uid: string, token: string | null): Promise<UserResponse> {
  if (!token || token === 'null' || token === 'undefined') {
    console.log(`[user.service] No auth token for uid=${uid} — returning guest user`);
    return {
      uid: null,
      email: null,
      username: 'guest',
      full_name: null,
      roles: [],
      is_active: false,
      is_email_verified: false,
      is_logged_in: false,
      created_at: null,
    };
  }

  console.log(`[user.service] Fetching user uid=${uid} from backend...`);

  const response = await fetch(`${getApiBaseUrlRaw()}/api/auth/me`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[user.service] Backend returned ${response.status}`);

    // 404: user in Firebase but not in DB
    if (response.status === 404) {
      console.log(`[user.service] User not found in DB, needs sync`);
      return {
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
      };
    }

    // 401/403: return guest user
    if (response.status === 401 || response.status === 403) {
      return {
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
      };
    }

    throw new Error(errorText || `Failed to get user (HTTP ${response.status})`);
  }

  const userData = await response.json();

  console.log('[user.service] Backend /api/auth/me response:', userData);
  console.log('[user.service] user_id from backend:', userData.user_id);

  return {
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
  };
}
